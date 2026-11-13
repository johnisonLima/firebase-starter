import { readFile } from 'node:fs/promises';

import { initializeTestEnvironment, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, setDoc } from 'firebase/firestore';

// The demo prefix and explicit emulator endpoint prevent access to production.
export const FIRESTORE_RULES_PROJECT_ID = 'demo-firebase-starter-rules';
export const FIRESTORE_EMULATOR_HOST = '127.0.0.1';
export const FIRESTORE_EMULATOR_PORT = 8180;

export const USERS = {
  owner: { uid: 'user-owner', email: 'owner@example.com' },
  other: { uid: 'user-other', email: 'other@example.com' },
  third: { uid: 'user-third', email: 'third@example.com' },
} as const;

export const VALID_PROFILE = {
  email: USERS.other.email,
  name: 'Pessoa Teste',
  phone: '77999999999',
  birthDate: '1995-05-20',
  gender: null,
  neighborhood: 'Centro',
  city: 'Vitória da Conquista',
  state: 'BA',
  photoURL: null,
};

export async function initializeFirestoreRulesTestEnvironment(): Promise<RulesTestEnvironment> {
  const rules = await readFile(new URL('../../firestore.rules', import.meta.url), 'utf8');
  return initializeTestEnvironment({
    projectId: FIRESTORE_RULES_PROJECT_ID,
    firestore: { host: FIRESTORE_EMULATOR_HOST, port: FIRESTORE_EMULATOR_PORT, rules },
  });
}

export function authenticatedUser(
  environment: RulesTestEnvironment,
  user: { uid: string; email: string } = USERS.owner,
  claims: Record<string, boolean> = {},
  emailVerified = true,
) {
  return environment
    .authenticatedContext(user.uid, {
      email: user.email,
      email_verified: emailVerified,
      ...claims,
    })
    .firestore();
}

export async function seedProfiles(environment: RulesTestEnvironment): Promise<void> {
  await environment.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, 'users', USERS.owner.uid), { ...VALID_PROFILE, email: USERS.owner.email });
    await setDoc(doc(db, 'users', USERS.other.uid), { ...VALID_PROFILE, email: USERS.other.email });
    await setDoc(doc(db, 'users', USERS.third.uid), { ...VALID_PROFILE, email: USERS.third.email });
  });
}
