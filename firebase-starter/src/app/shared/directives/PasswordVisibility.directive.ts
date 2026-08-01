import { Directive, ElementRef, inject, signal, effect } from '@angular/core';

@Directive({
  selector: 'input[type=password][appPasswordVisibility]',
  standalone: true,
  exportAs: 'passwordVisibility',
})
export class PasswordVisibilityDirective {

  private readonly elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);

  readonly visible = signal(false);

  constructor() {
    effect(() => {
      this.elementRef.nativeElement.type = this.visible() ? 'text' : 'password';
    });
  }

  toggle(): void {
    this.visible.update((value) => !value);
  }
}