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

describe('Permissões do editor', () => {
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

  it('lê o próprio perfil e terceiros, além de listar a coleção', async () => {
    const db = authenticatedUser(env, USERS.owner, { canEditAllProfiles: true });
    await assertSucceeds(getDoc(doc(db, 'users', USERS.owner.uid)));
    await assertSucceeds(getDoc(doc(db, 'users', USERS.other.uid)));
    await assertSucceeds(getDocs(query(collection(db, 'users'))));
  });
  it('cria somente o próprio perfil', async () => {
    const db = authenticatedUser(env, USERS.owner, { canEditAllProfiles: true });
    await assertSucceeds(setDoc(doc(db, 'users', USERS.owner.uid), { email: USERS.owner.email }));
    await assertFails(setDoc(doc(db, 'users', 'stranger'), { email: USERS.owner.email }));
  });
  it('edita próprio e terceiros, mas preserva seus e-mails, e só exclui o próprio', async () => {
    const db = authenticatedUser(env, USERS.owner, { canEditAllProfiles: true });
    await assertSucceeds(updateDoc(doc(db, 'users', USERS.owner.uid), { name: 'Atualizado' }));
    await assertSucceeds(updateDoc(doc(db, 'users', USERS.other.uid), { name: 'Atualizado' }));
    await assertFails(updateDoc(doc(db, 'users', USERS.other.uid), { email: 'mudou@example.com' }));
    await assertSucceeds(deleteDoc(doc(db, 'users', USERS.owner.uid)));
    await assertFails(deleteDoc(doc(db, 'users', USERS.other.uid)));
  });
});
