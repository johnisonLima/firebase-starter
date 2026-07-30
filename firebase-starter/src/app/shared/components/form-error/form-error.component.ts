import {ChangeDetectionStrategy, Component, computed, input,} from '@angular/core';

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

  protected readonly errorMessage = computed(() => {

    const control = this.control();

    if (!control.touched || !control.errors) {
      return null;
    }

    return getControlErrorMessage(control, this.label());

  });

}