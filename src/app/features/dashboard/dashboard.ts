// Angular
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

// Components
import { ThemeToggle } from '@shared/components/theme-toggle/theme-toggle';
import { Button } from '@shared/components/button/button';

// Services
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    // Angular
    CommonModule,
    // Components
    ThemeToggle,
    Button
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  
  readonly authService = inject(AuthService);
  readonly router = inject(Router);
  
  qualquercoisa: string = 'qualquer coisa';

  async logout(): Promise<void> {
    await this.authService.logout();

    this.router.navigate(['/login']);
  }
}
