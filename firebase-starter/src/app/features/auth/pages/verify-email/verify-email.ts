import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';

// Spartan
import { HlmCardImports } from '@spartan-ng/helm/card';

// Components
import { AppLogoComponent } from '@shared//components/app-logo/app-logo.component';

@Component({
  selector: 'app-verify-email',
  imports: [
    // Angular
    RouterModule,
    // Spartan
    HlmCardImports,
    // Components
    AppLogoComponent,
  ],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmail { private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected readonly loading = this.authService.loading;
  protected readonly error = this.authService.error;
  readonly emailRegistered = this.authService.userEmail;

  protected readonly emailVerified = this.authService.sendEmailVerification;

  // Adicionar quando implementar o guarda de rota
  async checkVerification(): Promise<void> {

    await this.authService.reloadUser();

    // Adicionar quando implementar o guarda de rota
    // if (this.emailVerified()) {
    //   await this.router.navigate(['/']);
    // }

  }

  // Verificar esse fluxo de envio de email de verificação, pois o firebase não permite enviar mais de 5 emails por hora para o mesmo usuário.
  async resendVerificationEmail(): Promise<void> {

    await this.authService.sendEmailVerification();

  }

}