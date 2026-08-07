import { Provider } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';

import { firebaseConfig } from '../config/firebase.config';
import { FIREBASE_APP, FIRESTORE } from './firebase.tokens';
import { getFirestore } from 'firebase/firestore';

export function provideFirebase(): Provider[] {
  return [
    {
      provide: FIREBASE_APP,
      useFactory: () => initializeApp(firebaseConfig)
    },
    {
      provide: FIRESTORE,
      useFactory: (app: FirebaseApp) => getFirestore(app),
      deps: [FIREBASE_APP]
    }
  ];
}