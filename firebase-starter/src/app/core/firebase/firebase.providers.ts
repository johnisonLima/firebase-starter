import { Provider } from '@angular/core';

import { firebaseConfig } from '../config/firebase.config';

import { FirebaseApp, initializeApp } from 'firebase/app';
import { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE } from './firebase.tokens';
import { getFirestore } from 'firebase/firestore';
import { Auth, browserLocalPersistence, initializeAuth } from 'firebase/auth';

export function provideFirebase(): Provider[] {
  return [
    {
      provide: FIREBASE_APP,
      useFactory: () => initializeApp(firebaseConfig)
    },

    {
      provide: FIREBASE_AUTH,
      useFactory: (app: FirebaseApp): Auth =>
        initializeAuth(app, {
          persistence: browserLocalPersistence,
        }),
      deps: [FIREBASE_APP],
    },

    {
      provide: FIRESTORE,
      useFactory: (app: FirebaseApp) => getFirestore(app),
      deps: [FIREBASE_APP]
    }
  ];
}