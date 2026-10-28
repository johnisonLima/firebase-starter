import { inject } from '@angular/core';
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, } from '@angular/common/http';

import { AuthService } from '@core/auth/auth.service';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

   const authService = inject(AuthService);

  return from(authService.getIdToken()).pipe(
    switchMap(token => {
      if (!token) {
        return next(req);
      }

      const authenticatedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next(authenticatedRequest);
    })
  );
};