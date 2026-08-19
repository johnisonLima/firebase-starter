import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';

import { provideFirebase } from './core/firebase/firebase.providers';

import { provideBrand } from './core/config/brand';

import { provideLucideConfig } from '@lucide/angular';

import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { loadingInterceptor } from '@core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideRouter(routes), 

    provideHttpClient(
      withInterceptors([
        authInterceptor,
        loadingInterceptor,
      ])
    ),

    ...provideFirebase(),

    provideBrand({
      name: 'Firebase Starter',
      description: 'Angular 21 + Firebase + Spartan UI',
      logo: 'images/logo.svg',
      favicon: 'favicon.ico',
    }),
    
    provideLucideConfig({
      strokeWidth: 1.5,
    }),
  ]
};
