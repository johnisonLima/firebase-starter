// Angular
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

// Core
import { AuthService } from '@core/auth/auth.service';

// Spartan
import { HlmCardImports } from '@spartan-ng/helm/card';

// Shared
import { ToastService } from '@shared/services/toast.service';

// Components
import { AppLogoComponent } from '@shared//components/app-logo/app-logo.component';
import { Button } from '@shared/components/button/button';

@Component({
  selector: 'app-verify-email',
  imports: [
    // Angular
    RouterModule,
    // Spartan
    HlmCardImports,
    // Components
    AppLogoComponent,
    Button,
  ],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmail implements OnInit  { 
  
  private readonly router = inject(Router);
  protected readonly resendingVerification = signal(false);

  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);


  protected readonly loading = this.authService.loading;
  protected readonly error = this.authService.error;
  readonly emailRegistered = this.authService.userEmail.apply((email: string) => email !== '');

  async ngOnInit(): Promise<void> {

    if (this.authService.emailVerified()) {
      await this.router.navigate(['/dashboard']);
    }
    
  }

  async checkVerification(): Promise<void> {

    await this.authService.reloadUser();

    if (this.authService.emailVerified()) {
      await this.router.navigate(['/dashboard']);
    }

  }

  async resendVerificationEmail(): Promise<void> {

  if (this.resendingVerification()) {
    return;
  }

  this.resendingVerification.set(true);

    try {

      await this.authService.sendEmailVerification();

      this.toastService.success(
        'E-mail de verificação reenviado com sucesso. Verifique sua caixa de entrada.'
      );

    } catch {

      this.toastService.error(
        'Não foi possível reenviar o e-mail de verificação. Tente novamente.'
      );

    } finally {

      this.resendingVerification.set(false);

    }

  }

}