import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideFirebase } from './core/firebase/firebase.providers';
import { provideBrand } from './core/config/brand';
import { provideLucideConfig } from '@lucide/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
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
