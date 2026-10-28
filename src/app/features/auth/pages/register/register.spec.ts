import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Register } from './register';
import { AuthService } from '../../../../core/auth/auth.service';
import { Brand } from '../../../../core/config/brand/brand.interface';
import { APP_BRAND } from '../../../../core/config/brand/brand.token';
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

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

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
      imports: [Register],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
