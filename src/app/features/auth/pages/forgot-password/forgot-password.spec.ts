import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPassword } from './forgot-password';
import { AuthService } from '../../../../core/auth/auth.service';
import { APP_BRAND } from '../../../../core/config/brand/brand.token';
import { Brand } from '../../../../core/config/brand/brand.interface';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';

const brand: Brand = {
  name: 'Firebase Starter',
  description: 'Aplicação de testes',
};

const authServiceMock = {
  isAuthenticated: () => false,
  loading: () => false,
  error: () => null,
  user: () => null,
  userName: () => '',
  userEmail: () => '',
  emailVerified: () => false,

  clearError: vi.fn(),
  logout: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
  resetPassword: vi.fn(),
  sendEmailVerification: vi.fn(),
  reloadUser: vi.fn(),
};

describe('ForgotPassword', () => {
  let component: ForgotPassword;
  let fixture: ComponentFixture<ForgotPassword>;

  beforeEach(async () => {
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
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
