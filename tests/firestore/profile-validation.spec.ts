import { afterAll, afterEach, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { deleteField, doc, setDoc, updateDoc } from 'firebase/firestore';
import {
  authenticatedUser,
  initializeFirestoreRulesTestEnvironment,
  seedProfiles,
  USERS,
  VALID_PROFILE,
} from './firestore.rules.test-utils';

describe('Validação dos documentos de perfil', () => {
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

  it('aceita criação somente com e-mail e rejeita documentos inválidos ou extras', async () => {
    const db = authenticatedUser(env);
    await env.clearFirestore();
    await assertSucceeds(setDoc(doc(db, 'users', USERS.owner.uid), { email: USERS.owner.email }));
    await env.clearFirestore();
    await assertFails(setDoc(doc(db, 'users', USERS.owner.uid), { name: 'Sem e-mail' }));
    await env.clearFirestore();
    await assertFails(setDoc(doc(db, 'users', USERS.owner.uid), { email: 42 }));
    await env.clearFirestore();
    await assertFails(setDoc(doc(db, 'users', USERS.owner.uid), { email: USERS.other.email }));
    await env.clearFirestore();
    await assertFails(
      setDoc(doc(db, 'users', USERS.owner.uid), { email: USERS.owner.email, name: 'Inicial' }),
    );
    await assertFails(setDoc(doc(db, 'users', 'terceiro'), { email: USERS.owner.email }));
  });

  it('não impõe limite de 254 caracteres ao e-mail quando ele corresponde ao token', async () => {
    const email = `${'x'.repeat(250)}@example.com`;
    const db = authenticatedUser(env, { uid: 'long-email-user', email });
    await env.clearFirestore();
    await assertSucceeds(setDoc(doc(db, 'users', 'long-email-user'), { email }));
  });

  it('aceita campos opcionais válidos e rejeita campo adicional e e-mail ausente ou alterado', async () => {
    const db = authenticatedUser(env);
    const ref = doc(db, 'users', USERS.owner.uid);
    await assertSucceeds(
      updateDoc(ref, {
        name: 'Nome',
        phone: '123',
        neighborhood: 'Centro',
        city: 'Cidade',
        state: 'BA',
        birthDate: '2024-02-31',
        gender: null,
        photoURL: null,
      }),
    );
    await assertSucceeds(updateDoc(ref, { phone: deleteField(), neighborhood: deleteField() }));
    await assertFails(updateDoc(ref, { role: 'admin' }));
    await assertFails(updateDoc(ref, { email: deleteField() }));
    await assertFails(updateDoc(ref, { email: 'novo@example.com' }));
  });

  it('rejeita tipos inválidos, formatos inválidos e valores fora dos limites expressos pelas regras', async () => {
    const db = authenticatedUser(env);
    const ref = doc(db, 'users', USERS.owner.uid);
    await assertFails(updateDoc(ref, { name: 7 }));
    await assertFails(updateDoc(ref, { phone: 7 }));
    await assertFails(updateDoc(ref, { birthDate: '2024-2-01' }));
    await assertFails(updateDoc(ref, { gender: 7 }));
    await assertFails(updateDoc(ref, { neighborhood: 7 }));
    await assertFails(updateDoc(ref, { city: 7 }));
    await assertFails(updateDoc(ref, { state: 'Ba' }));
    await assertFails(updateDoc(ref, { photoURL: 7 }));
  });

  it('não impõe tamanho máximo aos campos opcionais e não valida o calendário da data', async () => {
    const db = authenticatedUser(env);
    const ref = doc(db, 'users', USERS.owner.uid);
    await assertSucceeds(
      updateDoc(ref, {
        name: 'N'.repeat(255),
        phone: 'P'.repeat(255),
        gender: 'G'.repeat(255),
        photoURL: 'U'.repeat(255),
        // A regra exige formato AAAA-MM-DD, mas não valida se a data existe no calendário.
        birthDate: '2024-02-31',
      }),
    );
  });
});
