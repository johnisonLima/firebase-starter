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
import { UserRepository } from '@core/data/repositories/user.repository';

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
  let authStateCallback: (user: User | null) => Promise<void>;
  const ensureProfileMock = vi.fn();

  const signInMock = vi.mocked(signInWithEmailAndPassword);
  const registerMock = vi.mocked(createUserWithEmailAndPassword);
  const sendEmailVerificationMock = vi.mocked(sendEmailVerification);
  const sendPasswordResetEmailMock = vi.mocked(sendPasswordResetEmail);
  const signOutMock = vi.mocked(signOut);

  beforeEach(() => {
    vi.resetAllMocks();

    authMock = { currentUser: null };
    ensureProfileMock.mockResolvedValue('created');
    authStateCallback = async () => {
      throw new Error('Callback de autenticação não configurado');
    };

    vi.mocked(onAuthStateChanged).mockImplementation((_auth, nextOrObserver) => {
      authStateCallback = nextOrObserver as unknown as (
        user: User | null,
      ) => Promise<void>;

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
        { provide: UserRepository, useValue: { ensureProfile: ensureProfileMock } },
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

      await authStateCallback(null);
      await initialization;

      expect(initialized).toBe(true);
      expect(service.authState()).toBe('unauthenticated');
      expect(service.loading()).toBe(false);
    });
  });

  describe('mudanças de estado de autenticação', () => {
    it('deve atualizar os signals derivados quando houver usuário', async () => {
      const user = createUser();
      authMock.currentUser = user;

      await authStateCallback(user);

      expect(service.authState()).toBe('authenticated');
      expect(service.user()).toBe(user);
      expect(service.isAuthenticated()).toBe(true);
      expect(service.userName()).toBe('Usuário E2E');
      expect(service.userEmail()).toBe('e2e@example.com');
      expect(service.photoURL()).toBe('https://example.com/photo.png');
      expect(service.emailVerified()).toBe(true);
      expect(service.loading()).toBe(false);
    });

    it('deve refletir o estado não autenticado quando não houver usuário', async () => {
      await authStateCallback(null);

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

  describe('concorrência do loading', () => {
    it('não encerra o loading de B quando um reload antigo de A termina', async () => {
      const userA = createUser({ uid: 'user-a' });
      const userB = createUser({ uid: 'user-b' });
      const reloadA = createDeferred<void>();
      const operationB = createDeferred<void>();
      authMock.currentUser = userA;
      await authStateCallback(userA);
      userA.reload.mockReturnValue(reloadA.promise);

      const oldReload = service.reloadUser();
      authMock.currentUser = userB;
      await authStateCallback(userB);
      sendPasswordResetEmailMock.mockReturnValue(operationB.promise);
      const currentOperation = service.resetPassword(userB.email!);

      expect(service.loading()).toBe(true);

      reloadA.resolve();
      await oldReload;

      expect(service.loading()).toBe(true);

      operationB.resolve();
      await currentOperation;

      expect(service.loading()).toBe(false);
    });

    it('mantém loading ativo até todas as operações concorrentes terminarem', async () => {
      const loginOperation = createDeferred<UserCredential>();
      const resetOperation = createDeferred<void>();
      signInMock.mockReturnValue(loginOperation.promise);
      sendPasswordResetEmailMock.mockReturnValue(resetOperation.promise);

      const login = service.login('a@example.com', 'senha');
      const reset = service.resetPassword('a@example.com');

      loginOperation.resolve({} as UserCredential);
      await login;

      expect(service.loading()).toBe(true);

      resetOperation.resolve();
      await reset;

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
      expect(ensureProfileMock).not.toHaveBeenCalled();
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

  describe('sincronização do perfil', () => {
    it('não garante perfil sem sessão, sem e-mail verificado ou sem e-mail', async () => {
      await authStateCallback(null);
      const unverified = createUser({ emailVerified: false });
      authMock.currentUser = unverified;
      await authStateCallback(unverified);
      const noEmail = createUser({ email: null });
      authMock.currentUser = noEmail;
      await authStateCallback(noEmail);

      expect(ensureProfileMock).not.toHaveBeenCalled();
    });

    it.each(['created', 'already-existed'] as const)(
      'considera sincronizado quando ensureProfile retorna %s', async result => {
        ensureProfileMock.mockResolvedValue(result);
        const user = createUser();
        authMock.currentUser = user;

        await authStateCallback(user);

        expect(ensureProfileMock).toHaveBeenCalledWith(user.uid, user.email);
        expect(service.profileSyncState()).toBe('synced');
      },
    );

    it('cria perfil quando reloadUser observa a verificação do e-mail', async () => {
      const user = createUser({ emailVerified: false });
      authMock.currentUser = user;
      await authStateCallback(user);
      ensureProfileMock.mockClear();
      user.reload.mockImplementation(async () => {
        (user as unknown as { emailVerified: boolean }).emailVerified = true;
      });

      await service.reloadUser();

      expect(ensureProfileMock).toHaveBeenCalledWith(user.uid, user.email);
      expect(service.profileSyncState()).toBe('synced');
    });

    it('não cria perfil quando reloadUser mantém o e-mail não verificado', async () => {
      const user = createUser({ emailVerified: false });
      authMock.currentUser = user;
      await authStateCallback(user);
      ensureProfileMock.mockClear();

      await service.reloadUser();

      expect(ensureProfileMock).not.toHaveBeenCalled();
    });

    it('isola falha de persistência do estado de autenticação e permite nova tentativa', async () => {
      const error = new Error('Firestore indisponível');
      const user = createUser();
      authMock.currentUser = user;
      ensureProfileMock.mockRejectedValueOnce(error);

      await authStateCallback(user);

      expect(service.profileSyncState()).toBe('error');
      expect(service.profileSyncError()).toBe(error);
      expect(service.authState()).toBe('authenticated');
      expect(authMock.currentUser).toBe(user);

      ensureProfileMock.mockResolvedValueOnce('already-existed');
      await service.reloadUser();

      expect(service.profileSyncState()).toBe('synced');
      expect(service.profileSyncError()).toBeNull();
      expect(service.authState()).toBe('authenticated');
    });

    it('ignora conclusão de sincronização da sessão anterior', async () => {
      const deferredA = createDeferred<'created' | 'already-existed'>();
      const deferredB = createDeferred<'created' | 'already-existed'>();
      ensureProfileMock
        .mockReturnValueOnce(deferredA.promise)
        .mockReturnValueOnce(deferredB.promise);
      const userA = createUser({ uid: 'user-a' });
      const userB = createUser({ uid: 'user-b' });
      authMock.currentUser = userA;
      const oldSession = authStateCallback(userA);
      authMock.currentUser = userB;
      const currentSession = authStateCallback(userB);
      deferredA.resolve('created');
      await oldSession;

      expect(service.profileSyncState()).toBe('syncing');
      deferredB.resolve('already-existed');
      await currentSession;

      expect(service.user()).toBe(userB);
      expect(service.profileSyncState()).toBe('synced');
      expect(ensureProfileMock).toHaveBeenNthCalledWith(1, 'user-a', userA.email);
      expect(ensureProfileMock).toHaveBeenNthCalledWith(2, 'user-b', userB.email);
    });

    it('não aplica reload antigo sobre os signals da sessão atual', async () => {
      const userA = createUser({ uid: 'user-a' });
      const userB = createUser({ uid: 'user-b' });
      const deferredReload = createDeferred<void>();
      authMock.currentUser = userA;
      await authStateCallback(userA);
      userA.reload.mockReturnValue(deferredReload.promise);
      const oldReload = service.reloadUser();

      authMock.currentUser = userB;
      await authStateCallback(userB);
      deferredReload.resolve();
      await oldReload;

      expect(service.user()).toBe(userB);
      expect(service.userEmail()).toBe(userB.email);
      expect(service.emailVerified()).toBe(userB.emailVerified);
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
