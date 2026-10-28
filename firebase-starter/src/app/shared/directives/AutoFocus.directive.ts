import { afterNextRender, AfterViewInit, Directive, ElementRef, inject, } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
  standalone: true,
})

export class AutofocusDirective {
  private readonly el = inject(ElementRef<HTMLElement>);

  constructor() {
    afterNextRender(() => {
      const host = this.el.nativeElement;

      const target = this.isFocusable(host)
        ? host
        : host.querySelector(
            'input, textarea, select, button, [tabindex]'
          );

      target?.focus();
    });
  }

  private isFocusable(el: HTMLElement): boolean {
    return el.matches('input, textarea, select, button, [tabindex]');
  }
}