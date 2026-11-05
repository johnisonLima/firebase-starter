import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthService } from '@core/auth/auth.service';

import { emailVerifiedGuard } from './email-verified.guard';

function createAuthServiceMock() {
  return {
    waitForAuthInitialization: vi.fn().mockResolvedValue(undefined),
    authState: vi.fn(),
    emailVerified: vi.fn(),
  };
}

describe('emailVerifiedGuard', () => {
  let authServiceMock: ReturnType<typeof createAuthServiceMock>;
  let routerMock: {
    createUrlTree: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    authServiceMock = createAuthServiceMock();
    routerMock = {
      createUrlTree: vi.fn(
        (commands: string[]) => ({ commands }) as unknown as UrlTree,
      ),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  async function runGuard() {
    return TestBed.runInInjectionContext(() =>
      emailVerifiedGuard(
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
      ),
    );
  }

  it('deve permitir o acesso quando o usuário estiver autenticado e verificado', async () => {
    authServiceMock.authState.mockReturnValue('authenticated');
    authServiceMock.emailVerified.mockReturnValue(true);

    await expect(runGuard()).resolves.toBe(true);
    expect(authServiceMock.waitForAuthInitialization).toHaveBeenCalledTimes(1);
    expect(routerMock.createUrlTree).not.toHaveBeenCalled();
  });

  it('deve redirecionar para verificação quando o e-mail não estiver verificado', async () => {
    authServiceMock.authState.mockReturnValue('authenticated');
    authServiceMock.emailVerified.mockReturnValue(false);

    await expect(runGuard()).resolves.toEqual({
      commands: ['/verify-email'],
    });
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/verify-email']);
  });

  it('deve redirecionar para login quando o usuário não estiver autenticado', async () => {
    authServiceMock.authState.mockReturnValue('unauthenticated');
    authServiceMock.emailVerified.mockReturnValue(false);

    await expect(runGuard()).resolves.toEqual({ commands: ['/login'] });
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
  });

  it('deve redirecionar para login enquanto o estado for desconhecido', async () => {
    authServiceMock.authState.mockReturnValue('unknown');
    authServiceMock.emailVerified.mockReturnValue(false);

    await expect(runGuard()).resolves.toEqual({ commands: ['/login'] });
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
  });
});
