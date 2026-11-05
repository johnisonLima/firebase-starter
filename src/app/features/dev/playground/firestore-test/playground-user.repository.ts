import { Inject, Injectable } from '@angular/core';

import { Firestore } from 'firebase/firestore';

import { BaseRepository } from '@core/data/repositories/base-repository';
import { FirestoreDataProvider } from '@core/data/providers/firestore-data-provider';
import { FIRESTORE } from '@core/firebase/firebase.tokens';

import { User } from '@features/users/models/user';

/**
 * Coleção exclusiva do Playground. Não reutiliza `Collections.USERS`
 * para manter os dados de demonstração separados dos dados de domínio.
 */
const PLAYGROUND_USERS_COLLECTION = 'playground_users';

@Injectable({
  providedIn: 'root',
})
export class PlaygroundUserRepository extends BaseRepository<User> {

  constructor(
    @Inject(FIRESTORE) firestore: Firestore,
  ) {
    super(
      new FirestoreDataProvider<User>(
        firestore,
        PLAYGROUND_USERS_COLLECTION,
      ),
    );
  }
}
