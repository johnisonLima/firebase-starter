import { Injectable, computed, inject, signal } from '@angular/core';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { getAuthErrorMessage } from './auth.errors';

import { FIREBASE_AUTH } from '../firebase/firebase.tokens';
import { UserRepository } from '@core/data/repositories/user.repository';

export type AuthState =
  | 'unknown'
  | 'authenticated'
  | 'unauthenticated';

export type ProfileSyncState =
  | 'idle'
  | 'syncing'
  | 'synced'
  | 'error';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly auth = inject(FIREBASE_AUTH);

  private readonly _user = signal<User | null>(null);
  private readonly _emailVerified = signal(false);
  private readonly _loading = signal(true);
  private readonly _error = signal<string | null>(null);

  private readonly _authState = signal<AuthState>('unknown');

  private _resolveAuthInitialization!: () => void;

  private readonly _profileSyncState = signal<ProfileSyncState>('idle');
  private readonly _profileSyncError = signal<unknown | null>(null);

  private _authSessionVersion = 0;
  private _pendingOperations = 0;

  readonly user = this._user.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly authState = this._authState.asReadonly();

  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly userName = computed(() => this.user()?.displayName ?? '');
  readonly userEmail = computed(() => this.user()?.email ?? '');
  readonly photoURL = computed(() => this.user()?.photoURL ?? '');
  readonly emailVerified = this._emailVerified.asReadonly();

  private readonly userRepository = inject(UserRepository);

  readonly profileSyncState = this._profileSyncState.asReadonly();
  readonly profileSyncError = this._profileSyncError.asReadonly();

  constructor() {
    onAuthStateChanged(this.auth, async user => {

      const sessionVersion = ++this._authSessionVersion;

      this._user.set(user);
      this._emailVerified.set(user?.emailVerified ?? false);

      this._authState.set(
        user
          ? 'authenticated'
          : 'unauthenticated'
      );

      if (user) {
        await this.ensureUserProfile(user, sessionVersion);
      } else {
        this._profileSyncState.set('idle');
        this._profileSyncError.set(null);
      }

      if (sessionVersion !== this._authSessionVersion) {
        return;
      }

      this.updateLoadingState();

      this._resolveAuthInitialization();
    });
  }

  private readonly _authInitialized = new Promise<void>(resolve => {
    this._resolveAuthInitialization = resolve;
  });

  async waitForAuthInitialization(): Promise<void> {
    await this._authInitialized;
  }

  async login(email: string, password: string): Promise<void> {
    await this.execute(() =>
      signInWithEmailAndPassword(this.auth, email, password)
    );
  }

  async register(email: string, password: string): Promise<void> {
    await this.execute(() =>
      createUserWithEmailAndPassword(this.auth, email, password)
    );
  }

  async sendEmailVerification(): Promise<void> {

    const user = this.auth.currentUser;

    if (!user) {
      throw new Error('No authenticated user.');
    }

    await this.execute(() => sendEmailVerification(user));

  }

  async logout(): Promise<void> {
    await this.execute(() => signOut(this.auth));
  }

  async resetPassword(email: string): Promise<void> {
    await this.execute(() =>
      sendPasswordResetEmail(this.auth, email)
    );
  }

  async reloadUser(): Promise<void> {

    const user = this.auth.currentUser;

    if (!user) {
      return;
    }

    const sessionVersion = this._authSessionVersion;

    await this.execute(() => user.reload());

    // Verifica se a sessão continua sendo a mesma.
    if (!this.isCurrentSession(user, sessionVersion)) {
      return;
    }

    const currentUser = this.auth.currentUser;

    this._user.set(currentUser);

    // O SDK muta a instância do usuário no reload. Atualizamos o signal
    // derivado explicitamente para que os guards reajam à nova verificação.
    this._emailVerified.set(currentUser?.emailVerified ?? false);

    if (currentUser) {
      await this.ensureUserProfile(currentUser, sessionVersion);
    }

  }

  async getIdToken(): Promise<string | null> {
    const user = this.auth.currentUser;

    if (!user) {
      return null;
    }

    return user.getIdToken();
  }

  clearError(): void {
    this._error.set(null);
  }

  private async execute<T>(action: () => Promise<T>): Promise<T> {
    this._pendingOperations += 1;
    this._loading.set(true);
    this._error.set(null);

    try {
      return await action();
    } catch (error) {
      this._error.set(getAuthErrorMessage(error));
      throw error;
    } finally {
      this._pendingOperations -= 1;
      this.updateLoadingState();
    }
  }

  private updateLoadingState(): void {
    this._loading.set(this._pendingOperations > 0);
  }

  private async ensureUserProfile(user: User, sessionVersion: number): Promise<void> {

    if (!this.isCurrentSession(user, sessionVersion)) {
      return;
    }

    if (!user.emailVerified || !user.email) {
      this._profileSyncState.set('idle');
      this._profileSyncError.set(null);
      return;
    }

    this._profileSyncState.set('syncing');
    this._profileSyncError.set(null);

    try {
      await this.userRepository.ensureProfile(user.uid, user.email);

      if (!this.isCurrentSession(user, sessionVersion)) {
        return;
      }

      this._profileSyncState.set('synced');

    } catch (error) {

      if (!this.isCurrentSession(user, sessionVersion)) {
        return;
      }

      this._profileSyncError.set(error);
      this._profileSyncState.set('error');
    }
  }

  private isCurrentSession(
    user: User,
    sessionVersion: number
  ): boolean {
    return (
      sessionVersion === this._authSessionVersion &&
      this.auth.currentUser?.uid === user.uid
    );
  }
}
