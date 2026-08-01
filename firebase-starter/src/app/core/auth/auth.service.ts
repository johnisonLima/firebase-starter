import { Injectable, computed, inject, signal } from '@angular/core';
import { Auth, User, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getAuthErrorMessage } from './auth.errors';

import { FIREBASE_APP } from '../firebase/firebase.tokens';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly app = inject(FIREBASE_APP);
  private readonly auth: Auth = getAuth(this.app);

  private readonly _user = signal<User | null>(null);
  private readonly _loading = signal(true);
  private readonly _error = signal<string | null>(null);

  readonly user = this._user.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly userName = computed(() => this.user()?.displayName ?? '');
  readonly userEmail = computed(() => this.user()?.email ?? '');
  readonly photoURL = computed(() => this.user()?.photoURL ?? '');
  readonly emailVerified = computed(() => this.user()?.emailVerified ?? false);

  constructor() {
    onAuthStateChanged(this.auth, user => {
      this._user.set(user);
      this._loading.set(false);
    });
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
      return;
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

    await this.execute(() => user.reload());

    this._user.set(this.auth.currentUser);

  }

  clearError(): void {
    this._error.set(null);
  }

  private async execute<T>(action: () => Promise<T>): Promise<T> {
    this._loading.set(true);
    this._error.set(null);

    try {
      return await action();
    } catch (error) {
      this._error.set(getAuthErrorMessage(error));
      throw error;
    } finally {
      this._loading.set(false);
    }
  }
}