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

describe('Permissões do usuário comum', () => {
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

  it('consulta somente o próprio perfil e não lista users', async () => {
    const db = authenticatedUser(env);
    await assertSucceeds(getDoc(doc(db, 'users', USERS.owner.uid)));
    await assertFails(getDoc(doc(db, 'users', USERS.other.uid)));
    await assertFails(getDocs(query(collection(db, 'users'))));
  });
  it('cria somente o próprio perfil', async () => {
    const db = authenticatedUser(env);
    await assertSucceeds(setDoc(doc(db, 'users', USERS.owner.uid), { email: USERS.owner.email }));
    await assertFails(setDoc(doc(db, 'users', 'stranger'), { email: USERS.owner.email }));
  });
  it('atualiza e exclui somente o próprio perfil, sem trocar e-mail', async () => {
    const db = authenticatedUser(env);
    await assertSucceeds(updateDoc(doc(db, 'users', USERS.owner.uid), { name: 'Nome atualizado' }));
    await assertFails(updateDoc(doc(db, 'users', USERS.owner.uid), { email: 'novo@example.com' }));
    await assertFails(updateDoc(doc(db, 'users', USERS.other.uid), { name: 'Alterado' }));
    await assertSucceeds(deleteDoc(doc(db, 'users', USERS.owner.uid)));
    await assertFails(deleteDoc(doc(db, 'users', USERS.other.uid)));
  });
});
