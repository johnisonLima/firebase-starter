// Angular
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

// Spartan
import { HlmCardImports } from '@spartan-ng/helm/card';

// Lucide
import { LucideMail, } from '@lucide/angular';

// Core
import { AuthService } from '../../../../core/auth/auth.service';

// Components
import { AppLogoComponent } from '@shared//components/app-logo/app-logo.component';
import { FormErrorComponent } from '@shared/components/form-error/form-error.component';
import { Button } from '@shared/components/button/button';
import { Input } from '@shared/components/input/input';

// Directives
import { AutofocusDirective } from '@shared/directives/AutoFocus.directive';

@Component({
  selector: 'app-forgot-password',
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    // Spartan
    HlmCardImports,
    // Lucide
    LucideMail,
    // Components
    AppLogoComponent,
    FormErrorComponent,
    Input,
    Button, 
    // Directives
    AutofocusDirective,
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPassword {
  
  protected readonly fb = inject(FormBuilder);
  protected readonly router = inject(Router);
  protected readonly authService = inject(AuthService);

  protected readonly loading = this.authService.loading;
  protected readonly error = this.authService.error;

  protected readonly success = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });
  
  protected readonly emailControl = this.form.controls.email;

  protected readonly formStatus = toSignal(
    this.form.statusChanges,
    { initialValue: this.form.status }
  );

  protected readonly canSubmit = computed(() =>
    this.formStatus() === 'VALID'
  );

  protected readonly formValue = toSignal(
    this.form.valueChanges, {
      initialValue: this.form.getRawValue(),
    },
  );

  constructor() {

    let initialized = false;

    effect(() => {

      this.formValue();

      if (!initialized) {
        initialized = true;
        return;
      }

      this.success.set(false);
      this.authService.clearError();

    });
  }

  async resetPassword(): Promise<void> {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email } = this.form.getRawValue();

    try {

      await this.authService.resetPassword(email);

      this.success.set(true);

    } catch {
      // O AuthService já tratou o erro.
    }
  }
}
