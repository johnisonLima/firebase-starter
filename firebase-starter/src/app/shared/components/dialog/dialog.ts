import { ChangeDetectionStrategy, Component, contentChild, ElementRef, HostListener, inject, input, output } from '@angular/core';

import { A11yModule, } from '@angular/cdk/a11y';
import { LucideX } from '@lucide/angular';
import { DialogIconDirective } from './dialog-icon.directive';
import { DialogFooterDirective } from './dialog-footer.directive';

export type DialogSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    A11yModule,
    LucideX,
  ],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dialog {  

  readonly open = input(false);

  readonly size = input<DialogSize>('sm');

  readonly title = input.required<string>();

  readonly description = input<string>();

  readonly closeOnEscape = input(true);

  readonly closeOnOverlayClick = input(false);

  readonly showCloseButton = input(true);

  readonly closed = output<void>();

  readonly titleId = `dialog-title-${crypto.randomUUID()}`;

  readonly descriptionId = `dialog-description-${crypto.randomUUID()}`;

  readonly hasIcon = contentChild(DialogIconDirective);

  readonly hasFooter = contentChild(DialogFooterDirective);

  close(): void {
    this.closed.emit();
  }

  onOverlayClick(): void {
    if (this.closeOnOverlayClick()) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: Event): void {
    if (!this.open()) {
      return;
    }

    if (!this.closeOnEscape()) {
      return;
    }

    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    event.preventDefault();

    this.close();
  }

}