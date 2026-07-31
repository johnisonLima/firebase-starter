import {ChangeDetectionStrategy, Component, computed, effect, input, signal,} from '@angular/core';

import { AbstractControl } from '@angular/forms';

import { getControlErrorMessage } from '@shared/utils/forms/error-messages';

@Component({
  selector: 'app-form-error',
  standalone: true,
  templateUrl: './form-error.component.html',
  styleUrl: './form-error.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FormErrorComponent {

  readonly control = input.required<AbstractControl>();

  readonly label = input<string>('');

  private readonly tick = signal(0);

  constructor() {
    effect((onCleanup) => {
      const control = this.control();

      const subscription = control.events.subscribe(() => {
        this.tick.update((value) => value + 1);
      });

      onCleanup(() => subscription.unsubscribe());
    });
  }

  protected readonly errorMessage = computed(() => {
    this.tick();

    const control = this.control();

    if (!control.touched || !control.errors) {
      return null;
    }

    return getControlErrorMessage(control, this.label());

  });

}