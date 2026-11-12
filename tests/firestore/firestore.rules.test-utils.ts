import { readFile } from 'node:fs/promises';

import {
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';

// The demo prefix prevents the test harness from targeting a real Firebase project.
export const FIRESTORE_RULES_PROJECT_ID = 'demo-firebase-starter-rules';
export const FIRESTORE_EMULATOR_HOST = '127.0.0.1';
export const FIRESTORE_EMULATOR_PORT = 8180;

export async function initializeFirestoreRulesTestEnvironment(): Promise<RulesTestEnvironment> {
  const rules = await readFile(
    new URL('../../firestore.rules', import.meta.url),
    'utf8',
  );

  return initializeTestEnvironment({
    projectId: FIRESTORE_RULES_PROJECT_ID,
    firestore: {
      host: FIRESTORE_EMULATOR_HOST,
      port: FIRESTORE_EMULATOR_PORT,
      rules,
    },
  });
}
