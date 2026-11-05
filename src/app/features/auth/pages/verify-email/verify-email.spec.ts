import { APP_BRAND } from './../../../../core/config/brand/brand.token';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';

import { VerifyEmail } from './verify-email';
import { AuthService } from '../../../../core/auth/auth.service';
import { Brand } from '../../../../core/config/brand/brand.interface';
import { ToastService } from '@shared/services/toast.service';

const brand: Brand = {
  name: 'Firebase Starter',
  description: 'Aplicação de testes',
};

const createAuthServiceMock = () => ({
  isAuthenticated: vi.fn(() => false),
  error: vi.fn(() => null),
  user: vi.fn(() => null),
  userName: vi.fn(() => ''),
  userEmail: vi.fn(() => 'e2e@example.com'),
  emailVerified: vi.fn(() => false),
  loading: signal(false),
  logout: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
  resetPassword: vi.fn(),
  sendEmailVerification: vi.fn(),
  reloadUser: vi.fn(),
});

const createToastServiceMock = () => ({
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
});

const createRouterMock = () => ({
  navigate: vi.fn(),
});

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return { promise, resolve, reject };
}

describe('VerifyEmail', () => {
  let component: VerifyEmail;
  let fixture: ComponentFixture<VerifyEmail>;
  let authServiceMock: ReturnType<typeof createAuthServiceMock>;
  let toastServiceMock: ReturnType<typeof createToastServiceMock>;
  let routerMock: ReturnType<typeof createRouterMock>;

  beforeEach(async () => {
    authServiceMock = createAuthServiceMock();
    toastServiceMock = createToastServiceMock();
    routerMock = createRouterMock();

    await TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
        {
          provide: ToastService,
          useValue: toastServiceMock,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
        {
          provide: APP_BRAND,
          useValue: brand,
        },
      ],
      imports: [VerifyEmail],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyEmail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o e-mail do usuário cadastrado', () => {
    fixture.detectChanges();

    expect(getText()).toContain(
      'Enviamos um e-mail de verificação para e2e@example.com.',
    );
  });

  it('deve redirecionar para o dashboard no ngOnInit quando o e-mail já estiver verificado', async () => {
    authServiceMock.emailVerified.mockReturnValue(true);

    await component.ngOnInit();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('deve permanecer na página no ngOnInit quando o e-mail não estiver verificado', async () => {
    authServiceMock.emailVerified.mockReturnValue(false);

    await component.ngOnInit();

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('deve recarregar o usuário e redirecionar quando a verificação for confirmada', async () => {
    authServiceMock.reloadUser.mockResolvedValue(undefined);
    authServiceMock.emailVerified.mockReturnValue(true);

    await component.checkVerification();

    expect(authServiceMock.reloadUser).toHaveBeenCalledTimes(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('deve recarregar o usuário e permanecer na página quando ainda não estiver verificado', async () => {
    authServiceMock.reloadUser.mockResolvedValue(undefined);
    authServiceMock.emailVerified.mockReturnValue(false);

    await component.checkVerification();

    expect(authServiceMock.reloadUser).toHaveBeenCalledTimes(1);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('não deve navegar quando a recarga do usuário falhar', async () => {
    authServiceMock.reloadUser.mockRejectedValue(
      new Error('falha na recarga'),
    );

    await expect(component.checkVerification()).rejects.toThrow(
      'falha na recarga',
    );

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('deve refletir o loading no botão de confirmação de verificação', () => {
    authServiceMock.loading.set(true);
    fixture.detectChanges();

    const button = getButtonByText('Já verifiquei meu e-mail');

    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
  });

  it('deve reenviar o e-mail e apresentar Toast de sucesso', async () => {
    authServiceMock.sendEmailVerification.mockResolvedValue(undefined);

    await component.resendVerificationEmail();
    fixture.detectChanges();

    expect(authServiceMock.sendEmailVerification).toHaveBeenCalledTimes(1);

    expect(toastServiceMock.success).toHaveBeenCalledTimes(1);
    expect(toastServiceMock.success).toHaveBeenCalledWith(
      'E-mail de verificação reenviado com sucesso. Verifique sua caixa de entrada.',
    );
    expect(toastServiceMock.error).not.toHaveBeenCalled();

    expect(getResendButton().disabled).toBe(false);
    expect(getResendButton().getAttribute('aria-busy')).toBeNull();
  });

  it('deve apresentar Toast de erro e encerrar o loading quando o reenvio falhar', async () => {
    authServiceMock.sendEmailVerification.mockRejectedValue(
      new Error('falha no reenvio'),
    );

    await component.resendVerificationEmail();
    fixture.detectChanges();

    expect(authServiceMock.sendEmailVerification).toHaveBeenCalledTimes(1);

    expect(toastServiceMock.error).toHaveBeenCalledTimes(1);
    expect(toastServiceMock.error).toHaveBeenCalledWith(
      'Não foi possível reenviar o e-mail de verificação. Tente novamente.',
    );
    expect(toastServiceMock.success).not.toHaveBeenCalled();

    expect(getResendButton().disabled).toBe(false);
    expect(getResendButton().getAttribute('aria-busy')).toBeNull();
  });

  it('não deve iniciar um novo reenvio enquanto a operação estiver pendente', async () => {
    const deferred = createDeferred<void>();
    authServiceMock.sendEmailVerification.mockReturnValue(deferred.promise);

    const firstAttempt = component.resendVerificationEmail();
    fixture.detectChanges();

    expect(authServiceMock.sendEmailVerification).toHaveBeenCalledTimes(1);
    expect(getResendButton().disabled).toBe(true);
    expect(getResendButton().getAttribute('aria-busy')).toBe('true');

    const secondAttempt = component.resendVerificationEmail();
    fixture.detectChanges();

    expect(authServiceMock.sendEmailVerification).toHaveBeenCalledTimes(1);
    expect(getResendButton().disabled).toBe(true);
    expect(getResendButton().getAttribute('aria-busy')).toBe('true');

    deferred.resolve(undefined);
    await Promise.all([firstAttempt, secondAttempt]);
    fixture.detectChanges();

    expect(toastServiceMock.success).toHaveBeenCalledTimes(1);

    expect(getResendButton().disabled).toBe(false);
    expect(getResendButton().getAttribute('aria-busy')).toBeNull();
  });

  it('deve refletir resendingVerification nos estados de loading e disabled do botão de reenvio', async () => {
    const deferred = createDeferred<void>();
    authServiceMock.sendEmailVerification.mockReturnValue(deferred.promise);

    expect(getResendButton().disabled).toBe(false);
    expect(getResendButton().getAttribute('aria-busy')).toBeNull();

    const attempt = component.resendVerificationEmail();
    fixture.detectChanges();

    expect(getResendButton().disabled).toBe(true);
    expect(getResendButton().getAttribute('aria-busy')).toBe('true');

    deferred.resolve(undefined);
    await attempt;
    fixture.detectChanges();

    expect(getResendButton().disabled).toBe(false);
    expect(getResendButton().getAttribute('aria-busy')).toBeNull();
  });

  it('deve permitir uma nova tentativa após uma falha', async () => {
    authServiceMock.sendEmailVerification
      .mockRejectedValueOnce(new Error('falha no reenvio'))
      .mockResolvedValueOnce(undefined);

    await component.resendVerificationEmail();
    fixture.detectChanges();

    expect(toastServiceMock.error).toHaveBeenCalledTimes(1);
    expect(toastServiceMock.success).not.toHaveBeenCalled();
    expect(getResendButton().disabled).toBe(false);

    await component.resendVerificationEmail();
    fixture.detectChanges();

    expect(authServiceMock.sendEmailVerification).toHaveBeenCalledTimes(2);
    expect(toastServiceMock.success).toHaveBeenCalledTimes(1);
    expect(toastServiceMock.error).toHaveBeenCalledTimes(1);
    expect(getResendButton().disabled).toBe(false);
  });

  function getButtonByText(text: string): HTMLButtonElement {
    const buttons = fixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;

    const button = Array.from(buttons).find(candidate =>
      candidate.textContent?.includes(text),
    );

    if (!button) {
      throw new Error(`Botão "${text}" não encontrado`);
    }

    return button;
  }

  function getResendButton(): HTMLButtonElement {
    return getButtonByText('Reenviar e-mail');
  }

  function getText(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? '';
  }
});
