import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

import {
  LucideUserRound,
  LucideSettings2,
  LucideLogOut,
  LucideChevronDown,
} from '@lucide/angular';

import { DOCUMENT } from '@angular/common';

export interface UserAccountDropdownUser {
  name: string;
  email: string;
  photoURL: string | null;
}

@Component({
  selector: 'app-user-account-dropdown',
  standalone: true,
  imports: [
    LucideUserRound,
    LucideSettings2,
    LucideLogOut,
    LucideChevronDown,
  ],
  templateUrl: './user-account-dropdown.html',
  styleUrl: './user-account-dropdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAccountDropdown {

  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  readonly menu = viewChild<ElementRef<HTMLElement>>('menu');

  readonly user = input.required<UserAccountDropdownUser>();

  readonly accountClick = output<void>();
  readonly appearanceClick = output<void>();
  readonly logoutClick = output<void>();

  readonly isOpen = signal(false);

  readonly displayName = computed(
    () => this.user().name || this.user().email
  );

  private outsideClickListener?: (event: PointerEvent) => void;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.removeOutsideClickListener();
    });
  }

  toggle(): void {
    if (this.isOpen()) {
      this.close();
      return;
    }

    this.open();
  }

  open(initialFocus: 'first' | 'last' = 'first'): void {
    if (this.isOpen()) {
      return;
    }

    this.isOpen.set(true);
    this.addOutsideClickListener();

    afterNextRender(
      () => {
        if (initialFocus === 'last') {
          this.focusLastItem();
        } else {
          this.focusFirstItem();
        }
      },
      { injector: this.injector }
    );
  }

  close(restoreFocus = false): void {
    if (!this.isOpen()) {
      return;
    }

    this.isOpen.set(false);
    this.removeOutsideClickListener();

    if (restoreFocus) {
      this.trigger()?.nativeElement.focus();
    }
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();

      if (!this.isOpen()) {
        this.open('first');
        return;
      }

      this.focusFirstItem();
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();

      if (!this.isOpen()) {
        this.open('last');
        return;
      }

      this.focusLastItem();
    }
  }

  onMenuKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusNextItem();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.focusPreviousItem();
        break;

      case 'Home':
        event.preventDefault();
        this.focusFirstItem();
        break;

      case 'End':
        event.preventDefault();
        this.focusLastItem();
        break;

      case 'Escape':
        event.preventDefault();
        this.close(true);
        break;
    }
  }

  onAccountClick(): void {
    this.close();
    this.accountClick.emit();
  }

  onAppearanceClick(): void {
    this.close();
    this.appearanceClick.emit();
  }

  onLogoutClick(): void {
    this.close();
    this.logoutClick.emit();
  }

  private focusFirstItem(): void {
    this.getMenuItems()[0]?.focus();
  }

  private focusLastItem(): void {
    const items = this.getMenuItems();

    items.at(-1)?.focus();
  }

  private focusNextItem(): void {
    const items = this.getMenuItems();
    const currentIndex = items.indexOf(
      this.document.activeElement as HTMLButtonElement
    );

    if (items.length === 0) {
      return;
    }

    const nextIndex = (currentIndex + 1) % items.length;

    items[nextIndex].focus();
  }

  private focusPreviousItem(): void {
    const items = this.getMenuItems();
    const currentIndex = items.indexOf(
      this.document.activeElement as HTMLButtonElement
    );

    if (items.length === 0) {
      return;
    }

    const previousIndex =
      (currentIndex - 1 + items.length) % items.length;

    items[previousIndex].focus();
  }

  private getMenuItems(): HTMLButtonElement[] {
    return Array.from(
      this.menu()?.nativeElement.querySelectorAll<HTMLButtonElement>(
        '[role="menuitem"]'
      ) ?? []
    );
  }

  private addOutsideClickListener(): void {
    if (this.outsideClickListener) {
      return;
    }

    this.outsideClickListener = (event: PointerEvent) => {
      const target = event.target;

      if (
        target instanceof Node &&
        !this.elementRef.nativeElement.contains(target)
      ) {
        this.close();
      }
    };

    this.document.addEventListener(
      'pointerdown',
      this.outsideClickListener
    );
  }

  private removeOutsideClickListener(): void {
    if (!this.outsideClickListener) {
      return;
    }

    this.document.removeEventListener(
      'pointerdown',
      this.outsideClickListener
    );

    this.outsideClickListener = undefined;
  }
}