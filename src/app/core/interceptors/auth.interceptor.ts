import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, } from '@angular/common/http';

import { from, switchMap } from 'rxjs';

import { AuthService } from '../auth/auth.service';

import { API_CONFIG } from '../config/api.config';

function isTrustedOrigin(req: HttpRequest<unknown>): boolean {
  try {
    const baseUrl =
      globalThis.document?.baseURI ??
      globalThis.location?.href;

    const url = baseUrl
      ? new URL(req.url, baseUrl)
      : new URL(req.url);

    const isHttpProtocol =
      url.protocol === 'http:' || url.protocol === 'https:';

    if (!isHttpProtocol) {
      return false;
    }

    return API_CONFIG.trustedOrigins.includes(url.origin);
  } catch {
    return false;
  }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isTrustedOrigin(req)) {
    return next(req);
  }

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
    }),
  );
};