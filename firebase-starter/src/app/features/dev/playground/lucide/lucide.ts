import { Component, inject } from '@angular/core';
import { LucideHouse, LucideSettings, LucideUser, } from '@lucide/angular';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-lucide',
  imports: [LucideHouse, LucideUser, LucideSettings],
  templateUrl: './lucide.html',
  styleUrl: './lucide.scss',
})
export class Lucide {

  readonly toastService = inject(ToastService);

  testToast(): void {
    this.toastService.success(
      'Operação realizada com sucesso!'
    );
  }

  testMultipleToasts(): void {
  this.toastService.success('Toast 1');
  this.toastService.info('Toast 2');
  this.toastService.success('Toast 3');
  this.toastService.warning('Toast 4');
  this.toastService.error('Toast 5');
  this.toastService.success('Toast 6');
  this.toastService.info('Toast 7');
}

}
