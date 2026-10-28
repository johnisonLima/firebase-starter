import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LoadingService } from '@shared/services/loading.service';
import { Loading } from '../loading/loading';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [
    Loading,
  ],
  templateUrl: './loading-overlay.html',
  styleUrl: './loading-overlay.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingOverlay {

  readonly loadingService = inject(LoadingService);
}
