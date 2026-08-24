import { booleanAttribute, ChangeDetectionStrategy, Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputSize = 'sm' | 'md' | 'lg';

export type InputWidth = 'auto' | 'full';

export type InputState = 'default' | 'error' | 'success';

export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search';

let nextId = 0;

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input),
      multi: true,
    },
  ],
})
export class Input implements ControlValueAccessor {
  readonly size = input<InputSize>('md');
  readonly width = input<InputWidth>('full');
  readonly state = input<InputState>('default');
  readonly type = input<InputType>('text');

  readonly autocomplete = input<HTMLInputElement['autocomplete']>('off');

  readonly label = input<string>();
  readonly placeholder = input<string>('');
  readonly hint = input<string>();
  readonly errorMessage = input<string>();

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonlyInput = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly showPasswordToggle = input(true, { transform: booleanAttribute });

  protected readonly inputId = `app-input-${nextId++}`;
  protected readonly value = model<string>('');

  protected readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  protected readonly isPasswordVisible = signal(false);
  protected readonly isPassword = computed(() => this.type() === 'password');

  protected readonly showToggleButton = computed(
    () => this.isPassword() && this.showPasswordToggle(),
  );

  protected readonly resolvedType = computed(() => {
    if (!this.isPassword()) return this.type();
    return this.isPasswordVisible() ? 'text' : 'password';
  });

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  protected togglePasswordVisibility(): void {
    this.isPasswordVisible.update((v) => !v);
  }

  protected handleInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.onChange(value);
  }

  protected handleBlur(): void {
    this.onTouched();
  }

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}