import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';

import { Brand } from '../../../../core/config/brand/brand.interface';
import { APP_BRAND } from '../../../../core/config/brand/brand.token';
import { AuthService } from '../../../../core/auth/auth.service';
import { VALIDATION_ERRORS } from '@shared/utils/forms/validator-errors';

import { Register } from './register';

const brand: Brand = {
  name: 'Firebase Starter',
  description: 'Aplicação de testes',
};

function createAuthServiceMock() {
  const loading = signal(false);
  const error = signal<string | null>(null);

  return {
    loading,
    error,
    clearError: vi.fn(() => error.set(null)),
    register: vi.fn().mockResolvedValue(undefined),
    sendEmailVerification: vi.fn().mockResolvedValue(undefined),
  };
}

interface RegisterTestApi {
  form: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
  }>;
  canSubmit: () => boolean;
  register: () => Promise<void>;
}

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let api: RegisterTestApi;
  let authServiceMock: ReturnType<typeof createAuthServiceMock>;
  let navigateSpy: ReturnType<typeof vi.fn>;

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
      imports: [Register],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    api = component as unknown as RegisterTestApi;

    const router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve validar os campos obrigatórios', () => {
    api.form.markAllAsTouched();
    fixture.detectChanges();

    expect(api.form.controls.email.hasError('required')).toBe(true);
    expect(api.form.controls.password.hasError('required')).toBe(true);
    expect(api.form.controls.confirmPassword.hasError('required')).toBe(true);
    expect(getText()).toContain('E-mail é obrigatório.');
    expect(getText()).toContain('Senha é obrigatório.');
    expect(getText()).toContain('Confirmação de senha é obrigatório.');
  });

  it('deve validar o formato do e-mail', () => {
    api.form.controls.email.setValue('email-invalido');
    api.form.controls.email.markAsTouched();
    fixture.detectChanges();

    expect(api.form.controls.email.hasError('email')).toBe(true);
    expect(getText()).toContain('E-mail inválido.');
  });

  it('deve validar o tamanho mínimo da senha', () => {
    api.form.controls.password.setValue('123');
    api.form.controls.password.markAsTouched();
    fixture.detectChanges();

    expect(api.form.controls.password.hasError('minlength')).toBe(true);
    expect(getText()).toContain('Senha deve possuir no mínimo 6 caracteres.');
  });

  it('deve rejeitar senhas diferentes na confirmação', () => {
    api.form.controls.email.setValue('e2e@example.com');
    api.form.controls.password.setValue('senha-segura');
    api.form.controls.confirmPassword.setValue('outra-senha');
    api.form.controls.confirmPassword.markAsTouched();
    fixture.detectChanges();

    expect(
      api.form.controls.confirmPassword.hasError(VALIDATION_ERRORS.EQUALS_TO),
    ).toBe(true);
    expect(api.form.invalid).toBe(true);
    expect(getText()).toContain('Os valores informados não coincidem.');
  });

  it('deve habilitar o botão quando todos os campos forem válidos', () => {
    fillValidForm();

    expect(api.form.valid).toBe(true);
    expect(api.canSubmit()).toBe(true);
    expect(getSubmitButton().disabled).toBe(false);
  });

  it('deve revalidar a confirmação quando a senha for alterada', () => {
    fillValidForm();

    expect(api.form.valid).toBe(true);

    api.form.controls.password.setValue('senha-alterada');
    fixture.detectChanges();

    expect(
      api.form.controls.confirmPassword.hasError(VALIDATION_ERRORS.EQUALS_TO),
    ).toBe(true);
    expect(api.form.invalid).toBe(true);
    expect(getSubmitButton().disabled).toBe(true);
  });

  it('deve refletir o estado de loading no botão', () => {
    fillValidForm();
    authServiceMock.loading.set(true);
    fixture.detectChanges();

    expect(getSubmitButton().disabled).toBe(true);
    expect(getSubmitButton().getAttribute('aria-busy')).toBe('true');
  });

  it('não deve cadastrar quando o formulário for inválido', async () => {
    await api.register();

    expect(authServiceMock.register).not.toHaveBeenCalled();
    expect(
      authServiceMock.sendEmailVerification,
    ).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(api.form.controls.email.touched).toBe(true);
  });

  it('deve cadastrar, enviar a verificação e navegar no sucesso', async () => {
    fillValidForm();

    await api.register();

    expect(authServiceMock.register).toHaveBeenCalledWith(
      'e2e@example.com',
      'senha-segura',
    );
    expect(authServiceMock.sendEmailVerification).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/verify-email']);
  });

  it('deve exibir o erro e não navegar quando o cadastro falhar', async () => {
    fillValidForm();
    authServiceMock.register.mockImplementation(() => {
      authServiceMock.error.set('Este e-mail já está em uso.');
      return Promise.reject(new Error('falha no cadastro'));
    });

    await api.register();
    fixture.detectChanges();

    expect(getText()).toContain('Este e-mail já está em uso.');
    expect(
      authServiceMock.sendEmailVerification,
    ).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  function fillValidForm(): void {
    api.form.setValue({
      email: 'e2e@example.com',
      password: 'senha-segura',
      confirmPassword: 'senha-segura',
    });
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
