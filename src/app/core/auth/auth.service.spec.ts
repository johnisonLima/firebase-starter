import { TestBed } from '@angular/core/testing';

import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type Auth,
  type User,
  type UserCredential,
} from 'firebase/auth';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FIREBASE_AUTH } from '../firebase/firebase.tokens';

import { AuthService } from './auth.service';

type MockUser = User & {
  reload: ReturnType<typeof vi.fn>;
  getIdToken: ReturnType<typeof vi.fn>;
};

function createUser(overrides: Partial<MockUser> = {}): MockUser {
  return {
    uid: 'user-1',
    email: 'e2e@example.com',
    displayName: 'Usuário E2E',
    photoURL: 'https://example.com/photo.png',
    emailVerified: true,
    reload: vi.fn().mockResolvedValue(undefined),
    getIdToken: vi.fn().mockResolvedValue('id-token'),
    ...overrides,
  } as unknown as MockUser;
}

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return { promise, resolve, reject };
}

describe('AuthService', () => {
  let service: AuthService;
  let authMock: { currentUser: User | null };
  let authStateCallback: (user: User | null) => void;

  const signInMock = vi.mocked(signInWithEmailAndPassword);
  const registerMock = vi.mocked(createUserWithEmailAndPassword);
  const sendEmailVerificationMock = vi.mocked(sendEmailVerification);
  const sendPasswordResetEmailMock = vi.mocked(sendPasswordResetEmail);
  const signOutMock = vi.mocked(signOut);

  beforeEach(() => {
    vi.resetAllMocks();

    authMock = { currentUser: null };
    authStateCallback = () => {
      throw new Error('Callback de autenticação não configurado');
    };

    vi.mocked(onAuthStateChanged).mockImplementation((_auth, nextOrObserver) => {
      authStateCallback = nextOrObserver as unknown as (
        user: User | null,
      ) => void;

      return () => {};
    });

    signInMock.mockResolvedValue({} as UserCredential);
    registerMock.mockResolvedValue({} as UserCredential);
    sendEmailVerificationMock.mockResolvedValue(undefined);
    sendPasswordResetEmailMock.mockResolvedValue(undefined);
    signOutMock.mockResolvedValue(undefined);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: FIREBASE_AUTH,
          useValue: authMock as unknown as Auth,
        },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  describe('estado inicial', () => {
    it('deve iniciar desconhecido, carregando e sem usuário', () => {
      expect(service.authState()).toBe('unknown');
      expect(service.loading()).toBe(true);
      expect(service.user()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
      expect(service.userName()).toBe('');
      expect(service.userEmail()).toBe('');
      expect(service.photoURL()).toBe('');
      expect(service.emailVerified()).toBe(false);
      expect(service.error()).toBeNull();
    });

    it('deve resolver waitForAuthInitialization somente após o primeiro estado', async () => {
      let initialized = false;

      const initialization = service.waitForAuthInitialization().then(() => {
        initialized = true;
      });

      await Promise.resolve();

      expect(initialized).toBe(false);

      authStateCallback(null);
      await initialization;

      expect(initialized).toBe(true);
      expect(service.authState()).toBe('unauthenticated');
      expect(service.loading()).toBe(false);
    });
  });

  describe('mudanças de estado de autenticação', () => {
    it('deve atualizar os signals derivados quando houver usuário', () => {
      const user = createUser();

      authStateCallback(user);

      expect(service.authState()).toBe('authenticated');
      expect(service.user()).toBe(user);
      expect(service.isAuthenticated()).toBe(true);
      expect(service.userName()).toBe('Usuário E2E');
      expect(service.userEmail()).toBe('e2e@example.com');
      expect(service.photoURL()).toBe('https://example.com/photo.png');
      expect(service.emailVerified()).toBe(true);
      expect(service.loading()).toBe(false);
    });

    it('deve refletir o estado não autenticado quando não houver usuário', () => {
      authStateCallback(null);

      expect(service.authState()).toBe('unauthenticated');
      expect(service.user()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
      expect(service.loading()).toBe(false);
    });
  });

  describe('login', () => {
    it('deve autenticar e encerrar o loading', async () => {
      const deferred = createDeferred<UserCredential>();
      signInMock.mockReturnValue(deferred.promise);

      const operation = service.login('e2e@example.com', 'senha-segura');

      expect(service.loading()).toBe(true);
      expect(service.error()).toBeNull();

      deferred.resolve({} as UserCredential);
      await operation;

      expect(signInMock).toHaveBeenCalledWith(
        authMock,
        'e2e@example.com',
        'senha-segura',
      );
      expect(service.loading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    it('deve mapear o erro e encerrar o loading quando o login falhar', async () => {
      const error = new FirebaseError(
        'auth/invalid-credential',
        'Credenciais inválidas',
      );
      const deferred = createDeferred<UserCredential>();
      signInMock.mockReturnValue(deferred.promise);

      const operation = service.login('e2e@example.com', 'senha-incorreta');

      expect(service.loading()).toBe(true);

      deferred.reject(error);

      await expect(operation).rejects.toBe(error);

      expect(service.error()).toBe('E-mail ou senha inválidos.');
      expect(service.loading()).toBe(false);
    });
  });

  describe('cadastro', () => {
    it('deve criar a conta e encerrar o loading', async () => {
      await service.register('novo@example.com', 'senha-segura');

      expect(registerMock).toHaveBeenCalledWith(
        authMock,
        'novo@example.com',
        'senha-segura',
      );
      expect(service.loading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    it('deve tratar erro de e-mail já cadastrado', async () => {
      const error = new FirebaseError(
        'auth/email-already-in-use',
        'E-mail em uso',
      );
      registerMock.mockRejectedValue(error);

      await expect(
        service.register('existente@example.com', 'senha-segura'),
      ).rejects.toBe(error);

      expect(service.error()).toBe('Este e-mail já está em uso.');
      expect(service.loading()).toBe(false);
    });
  });

  describe('logout', () => {
    it('deve encerrar a sessão e o loading', async () => {
      authStateCallback(createUser());

      await service.logout();

      expect(signOutMock).toHaveBeenCalledWith(authMock);
      expect(service.loading()).toBe(false);
      expect(service.error()).toBeNull();
    });
  });

  describe('recuperação de senha', () => {
    it('deve solicitar a redefinição e encerrar o loading', async () => {
      await service.resetPassword('e2e@example.com');

      expect(sendPasswordResetEmailMock).toHaveBeenCalledWith(
        authMock,
        'e2e@example.com',
      );
      expect(service.loading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    it('deve mapear erro do Firebase e encerrar o loading', async () => {
      const error = new FirebaseError(
        'auth/too-many-requests',
        'Muitas tentativas',
      );
      sendPasswordResetEmailMock.mockRejectedValue(error);

      await expect(
        service.resetPassword('e2e@example.com'),
      ).rejects.toBe(error);

      expect(service.error()).toBe(
        'Muitas tentativas. Tente novamente mais tarde.',
      );
      expect(service.loading()).toBe(false);
    });
  });

  describe('envio de verificação de e-mail', () => {
    it('deve rejeitar quando não houver usuário autenticado', async () => {
      authStateCallback(null);

      await expect(service.sendEmailVerification()).rejects.toThrow(
        'No authenticated user.',
      );

      expect(sendEmailVerificationMock).not.toHaveBeenCalled();
      expect(service.error()).toBeNull();
      expect(service.loading()).toBe(false);
    });

    it('deve enviar a verificação para o usuário autenticado', async () => {
      const user = createUser();
      authMock.currentUser = user;
      authStateCallback(user);

      await service.sendEmailVerification();

      expect(sendEmailVerificationMock).toHaveBeenCalledWith(user);
      expect(service.loading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    it('deve mapear o erro e encerrar o loading quando o envio falhar', async () => {
      const user = createUser();
      const error = new FirebaseError(
        'auth/too-many-requests',
        'Muitas tentativas',
      );
      authMock.currentUser = user;
      authStateCallback(user);
      sendEmailVerificationMock.mockRejectedValue(error);

      await expect(service.sendEmailVerification()).rejects.toBe(error);

      expect(service.error()).toBe(
        'Muitas tentativas. Tente novamente mais tarde.',
      );
      expect(service.loading()).toBe(false);
    });
  });

  describe('reloadUser', () => {
    it('deve retornar sem operação quando não houver usuário', async () => {
      authStateCallback(null);

      await service.reloadUser();

      expect(service.loading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    it('deve recarregar o usuário e atualizar o signal', async () => {
      const user = createUser();
      const updatedUser = createUser({ email: 'atualizado@example.com' });
      const deferred = createDeferred<void>();

      authMock.currentUser = user;
      authStateCallback(user);
      user.reload.mockReturnValue(deferred.promise);

      const operation = service.reloadUser();

      expect(service.loading()).toBe(true);
      expect(user.reload).toHaveBeenCalledTimes(1);

      authMock.currentUser = updatedUser;
      deferred.resolve();
      await operation;

      expect(service.user()).toBe(updatedUser);
      expect(service.userEmail()).toBe('atualizado@example.com');
      expect(service.loading()).toBe(false);
    });

    it('deve atualizar emailVerified quando o SDK mutar a mesma instância', async () => {
      const user = createUser({ emailVerified: false });

      authMock.currentUser = user;
      authStateCallback(user);

      expect(service.emailVerified()).toBe(false);

      user.reload.mockImplementation(async () => {
        (user as unknown as { emailVerified: boolean }).emailVerified = true;
      });

      await service.reloadUser();

      expect(service.user()).toBe(user);
      expect(service.emailVerified()).toBe(true);
    });
  });

  describe('getIdToken', () => {
    it('deve retornar null quando não houver usuário autenticado', async () => {
      authStateCallback(null);

      await expect(service.getIdToken()).resolves.toBeNull();
    });

    it('deve retornar o token do usuário autenticado', async () => {
      const user = createUser();
      authMock.currentUser = user;
      authStateCallback(user);

      await expect(service.getIdToken()).resolves.toBe('id-token');
      expect(user.getIdToken).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearError', () => {
    it('deve limpar o erro armazenado', async () => {
      signInMock.mockRejectedValue(
        new FirebaseError('auth/invalid-credential', 'Credenciais inválidas'),
      );

      await expect(
        service.login('e2e@example.com', 'senha-incorreta'),
      ).rejects.toBeInstanceOf(FirebaseError);

      expect(service.error()).toBe('E-mail ou senha inválidos.');

      service.clearError();

      expect(service.error()).toBeNull();
    });
  });
});
