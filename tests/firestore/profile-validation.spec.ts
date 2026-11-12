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

  it.each([
    { tamanho: 'abaixo do máximo', length: 253, permitido: true },
    { tamanho: 'exatamente no máximo', length: 254, permitido: true },
    { tamanho: 'acima do máximo', length: 255, permitido: false },
  ])('valida e-mail $tamanho ($length caracteres)', async ({ length, permitido }) => {
    const email = 'e'.repeat(length);
    const uid = `email-${length}`;
    const db = authenticatedUser(env, { uid, email });
    const write = setDoc(doc(db, 'users', uid), { email });
    if (permitido) {
      await assertSucceeds(write);
    } else {
      await assertFails(write);
    }
  });

  it('rejeita atualização de perfil que já contém e-mail acima do limite', async () => {
    const db = authenticatedUser(env);
    const oversizedEmail = 'e'.repeat(255);
    await env.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'users', USERS.owner.uid), {
        email: oversizedEmail,
      });
    });
    await assertFails(updateDoc(doc(db, 'users', USERS.owner.uid), { name: 'Nome atualizado' }));
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
        birthDate: '2024-02-29',
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

  it('permite valores abaixo e exatamente nos limites dos campos opcionais', async () => {
    const db = authenticatedUser(env);
    const ref = doc(db, 'users', USERS.owner.uid);
    await assertSucceeds(
      updateDoc(ref, {
        name: 'ã'.repeat(119),
        phone: 'P'.repeat(19),
        gender: 'G'.repeat(39),
        neighborhood: 'B'.repeat(99),
        city: 'C'.repeat(99),
        state: 'BA',
        photoURL: 'U'.repeat(2047),
        birthDate: '2024-02-29',
      }),
    );
    await assertSucceeds(
      updateDoc(ref, {
        name: 'é'.repeat(120),
        phone: 'P'.repeat(20),
        gender: 'G'.repeat(40),
        neighborhood: 'B'.repeat(100),
        city: 'C'.repeat(100),
        state: 'BA',
        photoURL: 'U'.repeat(2048),
        birthDate: '1995-05-20',
      }),
    );
    await assertFails(updateDoc(ref, { state: 'B' }));
    await assertFails(updateDoc(ref, { state: 'BAA' }));
  });

  it('rejeita valores acima do limite de cada campo opcional', async () => {
    const db = authenticatedUser(env);
    const ref = doc(db, 'users', USERS.owner.uid);
    await assertFails(updateDoc(ref, { name: 'N'.repeat(121) }));
    await assertFails(updateDoc(ref, { phone: 'P'.repeat(21) }));
    await assertFails(updateDoc(ref, { gender: 'G'.repeat(41) }));
    await assertFails(updateDoc(ref, { neighborhood: 'B'.repeat(101) }));
    await assertFails(updateDoc(ref, { city: 'C'.repeat(101) }));
    await assertFails(updateDoc(ref, { photoURL: 'U'.repeat(2049) }));
  });

  it.each([
    { caso: 'data válida em ano comum', date: '1995-05-20', valid: true },
    { caso: 'data válida em ano bissexto', date: '2024-02-29', valid: true },
    { caso: 'ano divisível por 400', date: '2000-02-29', valid: true },
    { caso: 'ano divisível por 400 em outro século', date: '2400-02-29', valid: true },
    { caso: 'século divisível por 100 e não por 400', date: '1900-02-29', valid: false },
    { caso: '29 de fevereiro em ano comum', date: '2023-02-29', valid: false },
    { caso: 'dia 31 em mês com 30 dias', date: '2025-04-31', valid: false },
    { caso: 'mês 13', date: '2025-13-01', valid: false },
    { caso: 'mês 00', date: '2025-00-10', valid: false },
    { caso: 'dia 00', date: '2025-01-00', valid: false },
    { caso: 'formato diferente de AAAA-MM-DD', date: '2025-2-01', valid: false },
    { caso: 'mais de 10 caracteres', date: '2025-01-011', valid: false },
    { caso: 'ano zero', date: '0000-01-01', valid: false },
  ])('$caso: $date', async ({ date, valid }) => {
    const db = authenticatedUser(env);
    const write = updateDoc(doc(db, 'users', USERS.owner.uid), { birthDate: date });
    if (valid) {
      await assertSucceeds(write);
    } else {
      await assertFails(write);
    }
  });
});
