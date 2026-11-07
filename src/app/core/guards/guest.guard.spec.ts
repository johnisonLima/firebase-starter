import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthService } from '@core/auth/auth.service';

import { guestGuard } from './guest.guard';

function createAuthServiceMock() {
  return {
    waitForAuthInitialization: vi.fn().mockResolvedValue(undefined),
    authState: vi.fn(),
  };
}

describe('guestGuard', () => {
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
      guestGuard(
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
      ),
    );
  }

  it('deve permitir o acesso quando o usuário não estiver autenticado', async () => {
    authServiceMock.authState.mockReturnValue('unauthenticated');

    await expect(runGuard()).resolves.toBe(true);
    expect(authServiceMock.waitForAuthInitialization).toHaveBeenCalledTimes(1);
    expect(routerMock.createUrlTree).not.toHaveBeenCalled();
  });

  it('deve permitir o acesso enquanto o estado for desconhecido', async () => {
    authServiceMock.authState.mockReturnValue('unknown');

    await expect(runGuard()).resolves.toBe(true);
    expect(routerMock.createUrlTree).not.toHaveBeenCalled();
  });

  it('deve redirecionar para o dashboard quando o usuário estiver autenticado', async () => {
    authServiceMock.authState.mockReturnValue('authenticated');

    await expect(runGuard()).resolves.toEqual({ commands: ['/dashboard'] });
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
  });
});
