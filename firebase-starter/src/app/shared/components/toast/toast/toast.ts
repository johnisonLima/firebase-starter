import { ChangeDetectionStrategy, Component, computed, effect, input, output } from '@angular/core';

import { LucideCheck, LucideCircleX, LucideInfo, LucideTriangleAlert, LucideX } from '@lucide/angular';

import { Toast, ToastType } from '@shared/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [
    LucideCheck,
    LucideInfo,
    LucideTriangleAlert,
    LucideCircleX,
    LucideX,
  ],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {

  readonly toast = input.required<Toast>();

  readonly closed = output<void>();

   constructor() {
    effect((onCleanup) => {
      const duration = this.toast().duration;

      if (duration === null) {
        return;
      }

      const timeoutId = setTimeout(() => {
        this.close();
      }, duration);

      onCleanup(() => {
        clearTimeout(timeoutId);
      });
    });
  }

  readonly icon = computed(() => {
    const icons: Record<ToastType, typeof LucideCheck | typeof LucideInfo | typeof LucideTriangleAlert | typeof LucideCircleX> = {
      success: LucideCheck,
      info: LucideInfo,
      warning: LucideTriangleAlert,
      error: LucideCircleX,
    };

    return icons[this.toast().type];
  });

  close(): void {
    this.closed.emit();
  }
}
