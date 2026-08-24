import { afterNextRender, AfterViewInit, Directive, ElementRef, inject, } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
  standalone: true,
})

export class AutofocusDirective implements AfterViewInit {
  private readonly el = inject(ElementRef<HTMLElement>);

  ngAfterViewInit(): void {
    const host = this.el.nativeElement;
    const target = this.isFocusable(host)
      ? host
      : (host.querySelector('input, textarea, select, button, [tabindex]') as HTMLElement | null);

    target?.focus();
  }

  private isFocusable(el: HTMLElement): boolean {
    return el.matches('input, textarea, select, button, [tabindex]');
  }
}