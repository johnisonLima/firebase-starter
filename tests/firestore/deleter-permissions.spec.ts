import { afterAll, afterEach, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  authenticatedUser,
  initializeFirestoreRulesTestEnvironment,
  seedProfiles,
  USERS,
} from './firestore.rules.test-utils';

describe('Permissões do excluidor', () => {
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
  beforeEach(async () => {
    await seedProfiles(env);
  });
  it('não ganha leitura, listagem ou edição de terceiros pela claim de exclusão', async () => {
    const db = authenticatedUser(env, USERS.owner, { canDeleteAllProfiles: true });
    await assertSucceeds(getDoc(doc(db, 'users', USERS.owner.uid)));
    await assertFails(getDoc(doc(db, 'users', USERS.other.uid)));
    await assertFails(getDocs(query(collection(db, 'users'))));
    await assertSucceeds(updateDoc(doc(db, 'users', USERS.owner.uid), { name: 'Meu perfil' }));
    await assertFails(updateDoc(doc(db, 'users', USERS.other.uid), { name: 'Outro' }));
  });
  it('cria somente o próprio perfil e exclui próprio e terceiros', async () => {
    const db = authenticatedUser(env, USERS.owner, { canDeleteAllProfiles: true });
    await assertSucceeds(setDoc(doc(db, 'users', USERS.owner.uid), { email: USERS.owner.email }));
    await assertFails(setDoc(doc(db, 'users', 'stranger'), { email: USERS.owner.email }));
    await assertSucceeds(deleteDoc(doc(db, 'users', USERS.owner.uid)));
    await assertSucceeds(deleteDoc(doc(db, 'users', USERS.other.uid)));
  });
});
