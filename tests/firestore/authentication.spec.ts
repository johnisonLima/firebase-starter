import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { assertFails, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import {
  authenticatedUser,
  initializeFirestoreRulesTestEnvironment,
  USERS,
  VALID_PROFILE,
} from './firestore.rules.test-utils';

describe('Autenticação nas regras do Firestore', () => {
  let env: RulesTestEnvironment;
  beforeAll(async () => {
    env = await initializeFirestoreRulesTestEnvironment();
  });
  afterEach(async () => {
    await env.clearFirestore();
  });
  afterAll(async () => {
    await env.cleanup();
  });

  it('nega leitura, criação, atualização e exclusão sem autenticação', async () => {
    const db = env.unauthenticatedContext().firestore();
    const ref = doc(db, 'users', USERS.owner.uid);
    await assertFails(getDoc(ref));
    await assertFails(setDoc(ref, { email: USERS.owner.email }));
    await assertFails(updateDoc(ref, { name: 'Novo nome' }));
    await assertFails(deleteDoc(ref));
  });

  it('nega leitura, criação, atualização e exclusão com e-mail não verificado', async () => {
    const db = authenticatedUser(env, USERS.owner, {}, false);
    const ref = doc(db, 'users', USERS.owner.uid);
    await assertFails(getDoc(ref));
    await assertFails(setDoc(ref, { email: USERS.owner.email }));
    await env.withSecurityRulesDisabled(async (context) => {
      const { setDoc: seed } = await import('firebase/firestore');
      await seed(doc(context.firestore(), 'users', USERS.owner.uid), {
        ...VALID_PROFILE,
        email: USERS.owner.email,
      });
    });
    await assertFails(updateDoc(ref, { name: 'Novo nome' }));
    await assertFails(deleteDoc(ref));
  });
});
