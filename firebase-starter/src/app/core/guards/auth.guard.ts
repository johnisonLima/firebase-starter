import { inject } from '@angular/core';
import {CanActivateFn, Router,} from '@angular/router';

import { AuthService } from '@core/auth/auth.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await authService.waitForAuthInitialization();

  if (authService.authState() === 'authenticated') {
    return true;
  }

  return router.createUrlTree(['/login']);
}; 