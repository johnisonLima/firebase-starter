import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';

import { Brand } from '../../../../core/config/brand/brand.interface';
import { APP_BRAND } from '../../../../core/config/brand/brand.token';
import { AuthService } from '../../../../core/auth/auth.service';

import { Login } from './login';

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
    login: vi.fn().mockResolvedValue(undefined),
  };
}

interface LoginTestApi {
  form: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }>;
  canSubmit: () => boolean;
  login: () => Promise<void>;
}

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let api: LoginTestApi;
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
      imports: [Login],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    api = component as unknown as LoginTestApi;

    const router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar com formulário inválido e botão desabilitado', () => {
    expect(api.form.invalid).toBe(true);
    expect(api.canSubmit()).toBe(false);
    expect(getSubmitButton().disabled).toBe(true);
  });

  it('deve validar os campos obrigatórios', () => {
    api.form.markAllAsTouched();
    fixture.detectChanges();

    expect(api.form.controls.email.hasError('required')).toBe(true);
    expect(api.form.controls.password.hasError('required')).toBe(true);
    expect(getText()).toContain('E-mail é obrigatório.');
    expect(getText()).toContain('Senha é obrigatório.');
  });

  it('deve validar o formato do e-mail', () => {
    api.form.controls.email.setValue('email-invalido');
    api.form.controls.email.markAsTouched();
    fixture.detectChanges();

    expect(api.form.controls.email.hasError('email')).toBe(true);
    expect(getText()).toContain('E-mail inválido.');
  });

  it('deve validar o tamanho mínimo da senha', () => {
    api.form.controls.email.setValue('e2e@example.com');
    api.form.controls.password.setValue('123');
    api.form.controls.password.markAsTouched();
    fixture.detectChanges();

    expect(api.form.controls.password.hasError('minlength')).toBe(true);
    expect(getText()).toContain('Senha deve possuir no mínimo 6 caracteres.');
  });

  it('deve habilitar o botão quando o formulário for válido', () => {
    fillValidForm();

    expect(api.form.valid).toBe(true);
    expect(api.canSubmit()).toBe(true);
    expect(getSubmitButton().disabled).toBe(false);
  });

  it('deve refletir o estado de loading no botão', () => {
    fillValidForm();
    authServiceMock.loading.set(true);
    fixture.detectChanges();

    expect(getSubmitButton().disabled).toBe(true);
    expect(getSubmitButton().getAttribute('aria-busy')).toBe('true');
  });

  it('deve exibir o erro de autenticação', () => {
    authServiceMock.error.set('E-mail ou senha inválidos.');
    fixture.detectChanges();

    expect(getText()).toContain('E-mail ou senha inválidos.');

    const alert = fixture.nativeElement.querySelector(
      '[role="alert"]',
    ) as HTMLElement | null;

    expect(alert?.textContent).toContain('E-mail ou senha inválidos.');
  });

  it('deve limpar o erro ao editar o formulário', () => {
    authServiceMock.error.set('E-mail ou senha inválidos.');
    fixture.detectChanges();

    api.form.controls.email.setValue('outro@example.com');
    fixture.detectChanges();

    expect(authServiceMock.clearError).toHaveBeenCalled();
    expect(getText()).not.toContain('E-mail ou senha inválidos.');
  });

  it('deve enviar as credenciais e navegar ao dashboard no sucesso', async () => {
    fillValidForm();

    await api.login();

    expect(authServiceMock.login).toHaveBeenCalledWith(
      'e2e@example.com',
      'senha-segura',
    );
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
  });

  it('não deve enviar nem navegar quando o formulário for inválido', async () => {
    await api.login();

    expect(authServiceMock.login).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(api.form.controls.email.touched).toBe(true);
    expect(api.form.controls.password.touched).toBe(true);
  });

  it('não deve navegar quando a autenticação falhar', async () => {
    fillValidForm();
    authServiceMock.login.mockRejectedValue(new Error('falha no login'));

    await api.login();

    expect(authServiceMock.login).toHaveBeenCalledTimes(1);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  function fillValidForm(): void {
    api.form.setValue({
      email: 'e2e@example.com',
      password: 'senha-segura',
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
