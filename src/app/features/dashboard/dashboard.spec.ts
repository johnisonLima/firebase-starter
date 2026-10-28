import { AuthService } from './../../core/auth/auth.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

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
      ],
      imports: [Dashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
