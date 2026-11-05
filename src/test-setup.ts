import { vi } from 'vitest';

interface FirebaseAuthMock {
  onAuthStateChanged: ReturnType<typeof vi.fn>;
  signInWithEmailAndPassword: ReturnType<typeof vi.fn>;
  createUserWithEmailAndPassword: ReturnType<typeof vi.fn>;
  sendEmailVerification: ReturnType<typeof vi.fn>;
  sendPasswordResetEmail: ReturnType<typeof vi.fn>;
  signOut: ReturnType<typeof vi.fn>;
}

const globalWithMock = globalThis as typeof globalThis & {
  __firebaseAuthMock?: FirebaseAuthMock;
};

/**
 * O builder de testes do Angular executa o Vitest com `isolate: false`, o que
 * compartilha o cache de módulos entre os arquivos de teste. Como o
 * `AuthService` importa `firebase/auth` no escopo do módulo, cada arquivo
 * poderia receber uma instância diferente do mock.
 *
 * As funções são mantidas no `globalThis` para que todos os arquivos de teste
 * usem exatamente as mesmas instâncias mockadas.
 */
vi.mock('firebase/auth', async importOriginal => {
  const actual = await importOriginal<typeof import('firebase/auth')>();

  const firebaseAuthMock = (globalWithMock.__firebaseAuthMock ??= {
    onAuthStateChanged: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    sendEmailVerification: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
    signOut: vi.fn(),
  });

  return {
    ...actual,
    ...firebaseAuthMock,
  };
});
