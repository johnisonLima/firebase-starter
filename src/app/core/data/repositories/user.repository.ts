import { Inject, Injectable } from '@angular/core';
import { Firestore } from 'firebase/firestore';

import { FIRESTORE } from '../../firebase/firebase.tokens';
import { User } from '../models/user';
import { FirestoreUserDataProvider } from '../providers/firestore-user-data-provider';
import {
  EnsureProfileResult,
  UserDataProvider,
} from '../providers/user-data-provider';

@Injectable({ providedIn: 'root' })
export class UserRepository {
  private readonly provider: UserDataProvider;

  constructor(
    @Inject(FIRESTORE) firestore: Firestore
  ) {
    this.provider = new FirestoreUserDataProvider(firestore);
  }

  public ensureProfile(
    uid: string,
    email: string
  ): Promise<EnsureProfileResult> {
    return this.provider.ensureProfile(uid, email);
  }

  public findById(uid: string): Promise<User | null> {
    return this.provider.findById(uid);
  }

  public delete(uid: string): Promise<void> {
    return this.provider.delete(uid);
  }

  public exists(uid: string): Promise<boolean> {
    return this.provider.exists(uid);
  }
}