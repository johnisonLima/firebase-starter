import { Provider } from '@angular/core';
import { initializeApp } from 'firebase/app';

import { firebaseConfig } from '../config/firebase.config';
import { FIREBASE_APP } from './firebase.tokens';

export function provideFirebase(): Provider[] {
  return [
    {
      provide: FIREBASE_APP,
      useFactory: () => initializeApp(firebaseConfig)
    }
  ];
}