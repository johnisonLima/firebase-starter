import { afterNextRender, Directive, ElementRef, inject, } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
  standalone: true,
})

export class AutofocusDirective {

  private readonly elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);

  constructor() {

    afterNextRender(() => {
      this.elementRef.nativeElement.focus();
    });

  }

}