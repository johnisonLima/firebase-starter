import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { APP_BRAND } from './brand.token';
import { Brand } from './brand.interface';

export function provideBrand(brand: Brand): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: APP_BRAND,
      useValue: brand,
    },
  ]);
}