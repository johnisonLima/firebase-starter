import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { HlmCardImports } from '@spartan-ng/helm/card';

import { AuthService } from '../../../../core/auth/auth.service';

import { AppLogoComponent } from '@shared//components/app-logo/app-logo.component';
import { FormErrorComponent } from '@shared/components/form-error/form-error.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppLogoComponent,
    FormErrorComponent,
    HlmCardImports
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  protected readonly fb = inject(FormBuilder);
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

  protected readonly canSubmit = computed(() =>
    this.form.valid && !this.loading()
  );

  async login(): Promise<void> {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();

    await this.authService.login(email, password);
  }

  protected togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  protected async onSubmit(): Promise<void> {
    // if (this.isSubmitting() || this.isGoogleSubmitting()) {
    //   return;
    // }

    // if (this.form.invalid) {
    //   this.form.markAllAsTouched();
    //   return;
    // }

    // this.errorMessage.set(null);
    // this.isSubmitting.set(true);

    // const { email, password } = this.form.getRawValue();
    // const result = await this.authService.loginWithEmail(email, password);

    // this.isSubmitting.set(false);

    // if (result.success) {
    //   await this.router.navigateByUrl('/dashboard');
    // } else {
    //   this.errorMessage.set(result.errorMessage ?? 'Não foi possível entrar.');
    // }
  }

  protected async onGoogleLogin(): Promise<void> {
  //   if (this.isSubmitting() || this.isGoogleSubmitting()) {
  //     return;
  //   }

  //   this.errorMessage.set(null);
  //   this.isGoogleSubmitting.set(true);

  //   const result = await this.authService.loginWithGoogle();

  //   this.isGoogleSubmitting.set(false);

  //   if (result.success) {
  //     await this.router.navigateByUrl('/dashboard');
  //   } else if (result.errorCode !== 'auth/popup-closed-by-user') {
  //     this.errorMessage.set(result.errorMessage ?? 'Não foi possível entrar com o Google.');
  //   }
  // }
  }
}