import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import type { RulesTestEnvironment } from '@firebase/rules-unit-testing';

import { initializeFirestoreRulesTestEnvironment } from './firestore.rules.test-utils';

describe('Firestore Security Rules', () => {
  let testEnvironment: RulesTestEnvironment | undefined;

  beforeAll(async () => {
    testEnvironment = await initializeFirestoreRulesTestEnvironment();
  });

  afterEach(async () => {
    await testEnvironment?.clearFirestore();
  });

  afterAll(async () => {
    await testEnvironment?.cleanup();
  });

  it('inicializa o cliente de teste conectado ao Firestore Emulator', () => {
    // Smoke check da infraestrutura; os cenários de autorização serão adicionados depois.
    expect(testEnvironment).toBeDefined();
    expect(testEnvironment!.unauthenticatedContext().firestore()).toBeDefined();
  });
});
