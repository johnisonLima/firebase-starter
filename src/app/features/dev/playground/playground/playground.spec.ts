import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

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

  it('deve renderizar a seção do Firestore Playground de forma visível', () => {
    const section = fixture.nativeElement.querySelector(
      '.firestore-test',
    ) as HTMLElement | null;
    const firestoreTest = fixture.nativeElement.querySelector(
      'app-firestore-test',
    ) as HTMLElement | null;

    expect(section).not.toBeNull();
    expect(section?.classList.contains('test-closed')).toBe(false);
    expect(firestoreTest).not.toBeNull();
    expect(firestoreTest?.textContent).toContain('Firestore Playground');
  });
});
