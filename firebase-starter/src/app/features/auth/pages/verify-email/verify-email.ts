// Angular
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

// Core
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
export class VerifyEmail implements OnInit  { 
  
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected readonly loading = this.authService.loading;
  protected readonly error = this.authService.error;
  readonly emailRegistered = this.authService.userEmail;

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

    await this.authService.sendEmailVerification();

  }

}