// Angular
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

// Components
import { ThemeToggle } from '@shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    // Angular
    CommonModule,
    // Components
    ThemeToggle
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  qualquercoisa: string = 'qualquer coisa';
}
