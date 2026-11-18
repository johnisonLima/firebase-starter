// Angular
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

// Components
import { ThemeToggle } from '@shared/components/theme-toggle/theme-toggle';
import { UserAccountDropdown, UserAccountDropdownUser } from '@shared/ui/user-account-dropdown/user-account-dropdown';

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
    UserAccountDropdown
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  
  readonly authService = inject(AuthService);
  readonly router = inject(Router);
  
  readonly dataProfile = computed<UserAccountDropdownUser>(() => ({
    name: this.authService.userName(),
    email: this.authService.userEmail(),
    photoURL: this.authService.photoURL() || null,
  }));

  async logout(): Promise<void> {
    await this.authService.logout();

    this.router.navigate(['/login']);
  }

  onAccountClick(): void {
    console.log('Account clicked');
  }

  onAppearanceClick(): void {
    console.log('Appearance clicked');
  }
}
