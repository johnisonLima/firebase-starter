// Angular
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

// Lucide
import { LucideMoon, LucideSun } from '@lucide/angular';

// Services
import { ThemeService } from '@shared/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [LucideSun, LucideMoon],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggle {

  readonly themeService = inject(ThemeService);

  readonly isDarkTheme = computed(
    () => this.themeService.currentTheme() === 'dark'
  );

  onToggle(): void {
    this.themeService.toggleColorTheme();
  }
}
