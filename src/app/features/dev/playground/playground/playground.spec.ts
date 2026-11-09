import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';

import { PlaygroundUserRepository } from '@features/dev/playground/firestore-test/playground-user.repository';

import { ThemeService } from '@shared/services/theme.service';
import { LoadingService } from '@shared/services/loading.service';
import { ToastService } from '@shared/services/toast.service';

import { Playground } from './playground';

const createAuthServiceMock = () => ({
  authState: () => 'authenticated',
  isAuthenticated: () => true,
  loading: () => false,
  emailVerified: () => true,
  logout: vi.fn(),
});

const createToastServiceMock = () => ({
  success: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
  error: vi.fn(),
});

const createLoadingServiceMock = () => ({
  isLoading: () => false,
  start: vi.fn(),
  stop: vi.fn(),
});

const createThemeServiceMock = () => ({
  currentTheme: () => 'light',
  toggleColorTheme: vi.fn(),
});

const createPlaygroundUserRepositoryMock = () => ({
  create: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

describe('Playground', () => {
  let component: Playground;
  let fixture: ComponentFixture<Playground>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: createAuthServiceMock() },
        { provide: ToastService, useValue: createToastServiceMock() },
        { provide: LoadingService, useValue: createLoadingServiceMock() },
        { provide: ThemeService, useValue: createThemeServiceMock() },
        { provide: HttpClient, useValue: { get: vi.fn() } },
        {
          provide: PlaygroundUserRepository,
          useValue: createPlaygroundUserRepositoryMock(),
        },
      ],
      imports: [Playground],
    }).compileComponents();

    fixture = TestBed.createComponent(Playground);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir as cinco categorias e suas demonstrações sem ocultá-las', () => {
    const element = fixture.nativeElement as HTMLElement;
    const categories = element.querySelectorAll('.playground-category');
    const demos = element.querySelectorAll('.demo-panel');
    const expectedCategories = [
      'Interface e Design System',
      'Feedback e Interação',
      'Autenticação',
      'Firebase',
      'Integrações HTTP',
    ];
    const expectedDemoIds = [
      'demo-tema', 'icon', 'demo-button', 'demo-inputs',
      'toast', 'dialog', 'loading', 'demo-guard',
      'demo-firestore', 'demo-interceptor',
    ];

    expect([...categories].map((category) => category.querySelector('h2')?.textContent?.trim()))
      .toEqual(expectedCategories);
    expect([...demos].map((demo) => demo.id)).toEqual(expectedDemoIds);
    expect(element.querySelector('.test-closed')).toBeNull();
    expect(element.querySelector('app-firestore-test')?.textContent)
      .toContain('Firestore Playground');
  });

  it('deve oferecer links de âncora válidos para cada categoria', () => {
    const element = fixture.nativeElement as HTMLElement;
    const links = [...element.querySelectorAll<HTMLAnchorElement>('.category-nav a')];

    expect(links).toHaveLength(5);
    for (const link of links) {
      const url = new URL(link.href);
      const targetId = url.hash.slice(1);
      expect(url.pathname).toBe('/playground');
      expect(targetId).toBeTruthy();
      expect(element.querySelector(`#${targetId}`)).not.toBeNull();
    }
  });

  it('deve atualizar o modelo ao preencher um campo de entrada', async () => {
    const emailInput = fixture.nativeElement.querySelector(
      'app-input[label="E-mail"] input',
    ) as HTMLInputElement;

    emailInput.value = 'pessoa@example.com';
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();

    expect(component.inputEmail).toBe('pessoa@example.com');
  });

  it('deve manter a ação de exibir notificação ligada ao serviço', () => {
    const toastService = TestBed.inject(ToastService);
    const button = [...fixture.nativeElement.querySelectorAll('button')]
      .find((candidate) => candidate.textContent.includes('Exibir notificação')) as HTMLButtonElement;

    button.click();

    expect(toastService.success).toHaveBeenCalledWith(
      'Operação realizada com sucesso!',
    );
  });
});
