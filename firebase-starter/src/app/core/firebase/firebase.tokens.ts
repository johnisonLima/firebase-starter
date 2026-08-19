import { InjectionToken } from '@angular/core';

import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

export const FIREBASE_APP = new InjectionToken<FirebaseApp>(
  'FIREBASE_APP'
);

export const FIRESTORE = new InjectionToken<Firestore>(
  'FIRESTORE'
);

export const FIREBASE_AUTH = new InjectionToken<Auth>(
  'FIREBASE_AUTH'
);