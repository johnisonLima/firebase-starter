import { InjectionToken } from '@angular/core';
import { Brand } from './brand.interface';

export const APP_BRAND = new InjectionToken<Brand>('APP_BRAND');