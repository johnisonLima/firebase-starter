import { booleanAttribute, ChangeDetectionStrategy, Directive, HostBinding, input, } from '@angular/core';

import { Loading } from '../loading/loading';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive';

export type ButtonSize =
  | 'sm'
  | 'md'
  | 'lg';

export type ButtonWidth =
  | 'auto'
  | 'full';

@Directive({
  selector: 'button[app-button]',
  standalone: true,
  host: {
    class: 'btn',
  },
})
export class ButtonDirective {

  readonly variant = input<ButtonVariant>('primary');

  readonly size = input<ButtonSize>('md');

  readonly width = input<ButtonWidth>('auto');

  readonly loading = input(false, {
    transform: booleanAttribute,
  });

  readonly disabled = input(false, {
    transform: booleanAttribute,
  });

  @HostBinding('class.btn-primary')
  get isPrimary(): boolean {
    return this.variant() === 'primary';
  }

  @HostBinding('class.btn-secondary')
  get isSecondary(): boolean {
    return this.variant() === 'secondary';
  }

  @HostBinding('class.btn-outline')
  get isOutline(): boolean {
    return this.variant() === 'outline';
  }

  @HostBinding('class.btn-ghost')
  get isGhost(): boolean {
    return this.variant() === 'ghost';
  }

  @HostBinding('class.btn-destructive')
  get isDestructive(): boolean {
    return this.variant() === 'destructive';
  }

  @HostBinding('class.btn-sm')
  get isSmall(): boolean {
    return this.size() === 'sm';
  }

  @HostBinding('class.btn-md')
  get isMedium(): boolean {
    return this.size() === 'md';
  }

  @HostBinding('class.btn-lg')
  get isLarge(): boolean {
    return this.size() === 'lg';
  }

  @HostBinding('class.btn-full')
  get isFull(): boolean {
    return this.width() === 'full';
  }

  @HostBinding('attr.disabled')
  get disabledAttribute(): '' | null {
    return this.disabled() || this.loading()
      ? ''
      : null;
  }

  @HostBinding('attr.aria-busy')
  get ariaBusy(): 'true' | null {
    return this.loading()
      ? 'true'
      : null;
  }
}