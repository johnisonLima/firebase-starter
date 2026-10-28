import { APP_BRAND } from './../../../../core/config/brand/brand.token';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyEmail } from './verify-email';
import { AuthService } from '../../../../core/auth/auth.service';
import { Brand } from '../../../../core/config/brand/brand.interface';

const brand: Brand = {
  name: 'Firebase Starter',
  description: 'Aplicação de testes',
};

describe('VerifyEmail', () => {
  let component: VerifyEmail;
  let fixture: ComponentFixture<VerifyEmail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({      
      providers: [
        {
          provide: AuthService,
          useValue: {
            isAuthenticated: () => false,
            loading: () => false,
            error: () => null,
            user: () => null,
            userName: () => '',
            userEmail: () => '',
            emailVerified: () => false,
            logout: vi.fn(),
            login: vi.fn(),
            register: vi.fn(),
            resetPassword: vi.fn(),
            sendEmailVerification: vi.fn(),
            reloadUser: vi.fn(),
          },
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
});
