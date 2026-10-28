import { inject } from '@angular/core';
import { CanActivateFn, Router, } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';

export const emailVerifiedGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await authService.waitForAuthInitialization();

  if (
    authService.authState() === 'authenticated' &&
    authService.emailVerified()
  ) {
    return true;
  }

  if (authService.authState() === 'authenticated') {
    return router.createUrlTree(['/verify-email']);
  }

  return router.createUrlTree(['/login']);
};