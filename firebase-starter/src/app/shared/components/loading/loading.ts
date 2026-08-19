import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type LoadingSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Loading {

  readonly size = input<LoadingSize>('md');

  readonly text = input<string>();
}
