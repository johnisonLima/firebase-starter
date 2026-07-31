// Angular
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

// Spartan
import { HlmCardImports } from '@spartan-ng/helm/card';

// Core
import { AuthService } from '../../../../core/auth/auth.service';

// Components
import { AppLogoComponent } from '@shared//components/app-logo/app-logo.component';
import { FormErrorComponent } from '@shared/components/form-error/form-error.component';

// Validators
import { equalsToValidator } from '@shared/utils/forms/validators';


@Component({
  selector: 'app-register',
  imports: [    
    // Angular
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    // Spartan
    HlmCardImports,
    // Components
    AppLogoComponent,
    FormErrorComponent,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {  
  protected readonly fb = inject(FormBuilder);
  protected readonly router = inject(Router);
  protected readonly authService = inject(AuthService);

  protected readonly loading = this.authService.loading;
  protected readonly error = this.authService.error;

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],    
    confirmPassword: ['', [Validators.required, equalsToValidator('password'),],]
  });

  protected readonly emailControl = this.form.controls.email;
  protected readonly passwordControl = this.form.controls.password;
  protected readonly confirmPasswordControl = this.form.controls.confirmPassword;

  protected readonly formStatus = toSignal(
    this.form.statusChanges,
    { initialValue: this.form.status }
  );

  protected readonly canSubmit = computed(() =>
    this.formStatus() === 'VALID' && !this.loading()
  );

  protected readonly formValue = toSignal(
    this.form.valueChanges, {
      initialValue: this.form.getRawValue(),
    },
  );

  constructor() {

    effect(() => {

      this.formValue();

      this.authService.clearError();

    });

}

  async register(): Promise<void> {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();

    try {

      await this.authService.register(email, password);

      await this.router.navigate(['/']);

    } catch {
      // O AuthService já tratou o erro.
    }

  };
}
