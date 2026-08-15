import { Component, inject, signal } from '@angular/core';

// Teste Lucide
import { LucideHouse, LucideSettings, LucideTrash2, LucideUser, } from '@lucide/angular';

// Teste Toast
import { ToastService } from '@shared/services/toast.service';

// Teste Dialog
import { Dialog } from '@shared/components/dialog/dialog';
import { DialogIconDirective } from '@shared/components/dialog/dialog-icon.directive';
import { DialogFooterDirective } from '@shared/components/dialog/dialog-footer.directive';

@Component({
  selector: 'app-lucide',
  imports: [
    LucideHouse, 
    LucideUser, 
    LucideSettings,
    Dialog,
    LucideTrash2,
    DialogIconDirective,
    DialogFooterDirective,
  ],
  templateUrl: './lucide.html',
  styleUrl: './lucide.scss',
})
export class Lucide {

  readonly toastService = inject(ToastService);

  ngOnInit(): void {
    this.openDialog();
  }

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

  showDialog = signal(false);

  openDialog(): void {
    this.showDialog.set(true);
  }

  closeDialog(): void {
    this.showDialog.set(false);
  }

}
