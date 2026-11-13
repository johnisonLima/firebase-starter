import { Provider } from '@angular/core';

import { firebaseConfig } from '../config/firebase.config';

import { FirebaseApp, initializeApp } from 'firebase/app';
import { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE } from './firebase.tokens';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { Auth, browserLocalPersistence, connectAuthEmulator, initializeAuth } from 'firebase/auth';

declare const FIREBASE_USE_EMULATORS: boolean;

const useFirebaseEmulators =
  typeof FIREBASE_USE_EMULATORS !== 'undefined' && FIREBASE_USE_EMULATORS;

export function provideFirebase(): Provider[] {
  return [
    {
      provide: FIREBASE_APP,
      useFactory: () => initializeApp(firebaseConfig)
    },

    {
      provide: FIREBASE_AUTH,
      useFactory: (app: FirebaseApp): Auth => {

        const auth = initializeAuth(app, {
          persistence: browserLocalPersistence,
        });

        if (useFirebaseEmulators) {
          connectAuthEmulator(auth, 'http://localhost:9099');
        }

        return auth;
      },
      deps: [FIREBASE_APP],
    },

    {
      provide: FIRESTORE,
      useFactory: (app: FirebaseApp) => {

        const firestore = getFirestore(app);

        if (useFirebaseEmulators) {
          connectFirestoreEmulator(firestore, 'localhost', 8180);
        }

        return firestore;
      },
      deps: [FIREBASE_APP]
    }
  ];
}
