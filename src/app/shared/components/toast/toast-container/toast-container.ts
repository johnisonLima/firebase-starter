import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ToastService } from '../../../services/toast.service';

import { ToastComponent } from '../toast/toast';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [ToastComponent],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainer {

  readonly toastService = inject(ToastService);
  
}
