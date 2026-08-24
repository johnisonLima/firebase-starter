// Angular
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

// Spartan
import { HlmCardImports } from '@spartan-ng/helm/card';

// Lucide
import { LucideLock, LucideMail, LucideEye, LucideEyeOff} from '@lucide/angular';

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
    // Lucide
    LucideLock,
    LucideMail,
    LucideEye,
    LucideEyeOff,
    // Components
    AppLogoComponent,
    FormErrorComponent,
    Input,
    Button, 
    // Directives
    AutofocusDirective,
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

  // protected readonly isGoogleSubmitting = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected readonly emailControl = this.form.controls.email;
  protected readonly passwordControl = this.form.controls.password;

  protected readonly canSubmit = computed(() =>
    this.formStatus() === 'VALID'
  );


  protected readonly formStatus = toSignal(
    this.form.statusChanges,
    { initialValue: this.form.status }
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
}