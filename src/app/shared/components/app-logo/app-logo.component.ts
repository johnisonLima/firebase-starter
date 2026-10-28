import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { APP_BRAND, Brand } from '@core/config/brand';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [],
  templateUrl: './app-logo.component.html',
  styleUrl: './app-logo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLogoComponent {

  protected readonly brand: Brand = inject(APP_BRAND);

  readonly showName = input(true);

  readonly showDescription = input(true);

  readonly vertical = input(true);

  readonly size = input(150);

}