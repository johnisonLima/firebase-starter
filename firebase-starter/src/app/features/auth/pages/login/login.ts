// Angular
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
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

@Component({
  selector: 'app-login',
  standalone: true,
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
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  protected readonly fb = inject(FormBuilder);
  protected readonly router = inject(Router);
  protected readonly authService = inject(AuthService);

  protected readonly loading = this.authService.loading;
  protected readonly error = this.authService.error;

  protected readonly showPassword = signal(false);
  // protected readonly isGoogleSubmitting = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected readonly emailControl = this.form.controls.email;
  protected readonly passwordControl = this.form.controls.password;

    protected readonly formStatus = toSignal(
    this.form.statusChanges,
    { initialValue: this.form.status }
  );

  protected readonly canSubmit = computed(() =>
    this.formStatus() === 'VALID' && !this.loading()
  );

  async login(): Promise<void> {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();

    try {
      await this.authService.login(email, password);
      
      this.router.navigate(['/dashboard']); // ou a rota que fizer sentido
    } catch {
      // O AuthService já atualizou o estado de erro.
      // Nada a fazer aqui.
    }   
  }

  protected togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }
}