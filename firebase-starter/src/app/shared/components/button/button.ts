import { booleanAttribute, ChangeDetectionStrategy, Component, input, } from '@angular/core';

import { Loading } from '../loading/loading';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonWidth = 'auto' | 'full';

export type ButtonIconPosition = 'start' | 'end';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [Loading],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {

    readonly size = input<ButtonSize>('md');
    
    readonly variant = input<ButtonVariant>('primary');

    readonly width = input<ButtonWidth>('auto');

    readonly iconPosition = input<ButtonIconPosition>('start');

    readonly loading = input(false, {
        transform: booleanAttribute,
    });

    readonly disabled = input(false, {
        transform: booleanAttribute,
    });

    readonly iconOnly = input(false, {
      transform: booleanAttribute,
    });
}