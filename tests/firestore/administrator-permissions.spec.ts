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

describe('Permissões do administrador', () => {
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
  it('consulta e lista perfis e edita próprios e terceiros sem alterar e-mail', async () => {
    const db = authenticatedUser(env, USERS.owner, {
      canEditAllProfiles: true,
      canDeleteAllProfiles: true,
    });
    await assertSucceeds(getDoc(doc(db, 'users', USERS.owner.uid)));
    await assertSucceeds(getDoc(doc(db, 'users', USERS.other.uid)));
    await assertSucceeds(getDocs(query(collection(db, 'users'))));
    await assertSucceeds(updateDoc(doc(db, 'users', USERS.owner.uid), { name: 'Atualizado' }));
    await assertSucceeds(updateDoc(doc(db, 'users', USERS.other.uid), { name: 'Atualizado' }));
    await assertFails(updateDoc(doc(db, 'users', USERS.other.uid), { email: 'mudou@example.com' }));
  });
  it('cria somente o próprio perfil e exclui próprio e terceiros', async () => {
    const db = authenticatedUser(env, USERS.owner, {
      canEditAllProfiles: true,
      canDeleteAllProfiles: true,
    });
    await assertSucceeds(setDoc(doc(db, 'users', USERS.owner.uid), { email: USERS.owner.email }));
    await assertFails(setDoc(doc(db, 'users', 'stranger'), { email: USERS.owner.email }));
    await assertSucceeds(deleteDoc(doc(db, 'users', USERS.owner.uid)));
    await assertSucceeds(deleteDoc(doc(db, 'users', USERS.other.uid)));
  });
});
