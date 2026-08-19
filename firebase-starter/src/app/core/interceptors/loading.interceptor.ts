import { inject } from '@angular/core';
import { HttpContextToken, HttpInterceptorFn, } from '@angular/common/http';

import { finalize } from 'rxjs';

import { LoadingService } from '@shared/services/loading.service';

export const SKIP_LOADING = new HttpContextToken<boolean>(
  () => false
);

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    
  const loadingService = inject(LoadingService);

  if (req.context.get(SKIP_LOADING)) {
    return next(req);
  }

  loadingService.start();

  return next(req).pipe(
    finalize(() => {
      loadingService.stop();
    })
  );
};