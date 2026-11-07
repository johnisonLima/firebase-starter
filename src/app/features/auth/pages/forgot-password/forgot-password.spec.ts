import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';

import { Brand } from '../../../../core/config/brand/brand.interface';
import { APP_BRAND } from '../../../../core/config/brand/brand.token';
import { AuthService } from '../../../../core/auth/auth.service';

import { ForgotPassword } from './forgot-password';

const brand: Brand = {
  name: 'Firebase Starter',
  description: 'Aplicação de testes',
};

const SUCCESS_MESSAGE =
  'Se existir uma conta com este e-mail, enviaremos as instruções para redefinição de senha.';

function createAuthServiceMock() {
  const loading = signal(false);
  const error = signal<string | null>(null);

  return {
    loading,
    error,
    clearError: vi.fn(() => error.set(null)),
    resetPassword: vi.fn().mockResolvedValue(undefined),
  };
}

interface ForgotPasswordTestApi {
  form: FormGroup<{
    email: FormControl<string>;
  }>;
  canSubmit: () => boolean;
  success: () => boolean;
  resetPassword: () => Promise<void>;
}

describe('ForgotPassword', () => {
  let component: ForgotPassword;
  let fixture: ComponentFixture<ForgotPassword>;
  let api: ForgotPasswordTestApi;
  let authServiceMock: ReturnType<typeof createAuthServiceMock>;

  beforeEach(async () => {
    authServiceMock = createAuthServiceMock();

    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
        {
          provide: APP_BRAND,
          useValue: brand,
        },
      ],
      imports: [ForgotPassword],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPassword);
    component = fixture.componentInstance;
    api = component as unknown as ForgotPasswordTestApi;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve validar o campo obrigatório', () => {
    api.form.controls.email.markAsTouched();
    fixture.detectChanges();

    expect(api.form.controls.email.hasError('required')).toBe(true);
    expect(getText()).toContain('E-mail é obrigatório.');
  });

  it('deve validar o formato do e-mail', () => {
    api.form.controls.email.setValue('email-invalido');
    api.form.controls.email.markAsTouched();
    fixture.detectChanges();

    expect(api.form.controls.email.hasError('email')).toBe(true);
    expect(getText()).toContain('E-mail inválido.');
  });

  it('deve manter o botão desabilitado enquanto o formulário for inválido', () => {
    expect(api.form.invalid).toBe(true);
    expect(api.canSubmit()).toBe(false);
    expect(getSubmitButton().disabled).toBe(true);
  });

  it('deve habilitar o botão com e-mail válido', () => {
    fillValidForm();

    expect(api.form.valid).toBe(true);
    expect(api.canSubmit()).toBe(true);
    expect(getSubmitButton().disabled).toBe(false);
    expect(getSubmitButton().textContent).toContain('Enviar instruções');
  });

  it('deve refletir o estado de loading no botão', () => {
    fillValidForm();
    authServiceMock.loading.set(true);
    fixture.detectChanges();

    expect(getSubmitButton().disabled).toBe(true);
    expect(getSubmitButton().getAttribute('aria-busy')).toBe('true');
  });

  it('não deve solicitar a recuperação quando o formulário for inválido', async () => {
    await api.resetPassword();

    expect(authServiceMock.resetPassword).not.toHaveBeenCalled();
    expect(api.form.controls.email.touched).toBe(true);
  });

  it('deve solicitar a recuperação e exibir a mensagem de sucesso', async () => {
    fillValidForm();

    await api.resetPassword();
    fixture.detectChanges();

    expect(authServiceMock.resetPassword).toHaveBeenCalledWith(
      'e2e@example.com',
    );
    expect(api.success()).toBe(true);
    expect(getText()).toContain(SUCCESS_MESSAGE);
  });

  it('deve exibir o erro e não indicar sucesso quando a solicitação falhar', async () => {
    fillValidForm();
    authServiceMock.resetPassword.mockImplementation(() => {
      authServiceMock.error.set('Erro de conexão. Verifique sua internet.');
      return Promise.reject(new Error('falha na recuperação'));
    });

    await api.resetPassword();
    fixture.detectChanges();

    expect(api.success()).toBe(false);
    expect(getText()).toContain('Erro de conexão. Verifique sua internet.');
    expect(getText()).not.toContain(SUCCESS_MESSAGE);
  });

  it('deve limpar sucesso e erro ao editar o e-mail', async () => {
    fillValidForm();

    await api.resetPassword();
    fixture.detectChanges();

    expect(api.success()).toBe(true);
    expect(getText()).toContain(SUCCESS_MESSAGE);

    api.form.controls.email.setValue('outro@example.com');
    fixture.detectChanges();

    expect(authServiceMock.clearError).toHaveBeenCalled();
    expect(api.success()).toBe(false);
    expect(getText()).not.toContain(SUCCESS_MESSAGE);
  });

  function fillValidForm(): void {
    api.form.controls.email.setValue('e2e@example.com');
    fixture.detectChanges();
  }

  function getSubmitButton(): HTMLButtonElement {
    const button = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement | null;

    if (!button) {
      throw new Error('Botão de envio não encontrado');
    }

    return button;
  }

  function getText(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? '';
  }
});
