import {
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  runTransaction,
} from 'firebase/firestore';

import { Collections } from '../collections/collections';
import { User } from '../models/user';
import {
  EnsureProfileResult,
  UserDataProvider,
} from './user-data-provider';

export class FirestoreUserDataProvider implements UserDataProvider {
  constructor(
    private readonly firestore: Firestore
  ) {}

  public async ensureProfile(
    uid: string,
    email: string
  ): Promise<EnsureProfileResult> {
    const userRef = doc(
      this.firestore,
      Collections.USERS,
      uid
    );

    return runTransaction(this.firestore, async transaction => {
      const snapshot = await transaction.get(userRef);

      if (snapshot.exists()) {
        return 'already-existed';
      }

      transaction.set(userRef, { email });

      return 'created';
    });
  }

  public async findById(uid: string): Promise<User | null> {
    const userRef = doc(
      this.firestore,
      Collections.USERS,
      uid
    );

    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      ...snapshot.data(),
      id: snapshot.id,
    } as User;
  }

  public async delete(uid: string): Promise<void> {
    const userRef = doc(
      this.firestore,
      Collections.USERS,
      uid
    );

    await deleteDoc(userRef);
  }

  public async exists(uid: string): Promise<boolean> {
    const userRef = doc(
      this.firestore,
      Collections.USERS,
      uid
    );

    const snapshot = await getDoc(userRef);

    return snapshot.exists();
  }
}