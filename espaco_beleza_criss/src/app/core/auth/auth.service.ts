import { Injectable, computed, inject, signal } from '@angular/core';
import { Auth, User, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getAuthErrorMessage } from './auth.errors';

import { FIREBASE_APP } from '../firebase/firebase.tokens';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly app = inject(FIREBASE_APP);
  private readonly auth: Auth = getAuth(this.app);

  private readonly _currentUser = signal<User | null>(null);
  private readonly _loading = signal(true);
  private readonly _error = signal<string | null>(null);

  readonly currentUser = this._currentUser.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly userName = computed(() => this.currentUser()?.displayName ?? '');
  readonly userEmail = computed(() => this.currentUser()?.email ?? '');
  readonly photoURL = computed(() => this.currentUser()?.photoURL ?? '');

  constructor() {
    onAuthStateChanged(this.auth, user => {
      this._currentUser.set(user);
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

  async logout(): Promise<void> {
    await this.execute(() => signOut(this.auth));
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