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
  readonly isMenuRendered = signal(false);

  readonly displayName = computed(
    () => this.user().name || this.user().email
  );

  private outsideClickListener?: (event: PointerEvent) => void;
  private pendingTabCloseFrame: number | null = null;
  private pendingTabClose = false;
  private tabCloseGeneration = 0;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.close();
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
    this.cancelPendingTabClose();

    if (this.isOpen()) {
      return;
    }

    this.isOpen.set(true);
    this.isMenuRendered.set(true);
    this.addOutsideClickListener();
    const activeElementAtOpen = this.document.activeElement;

    afterNextRender(
      () => {
        if (this.document.activeElement !== activeElementAtOpen) {
          if (this.isOpen()) {
            this.close();
          }
          return;
        }

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
    const shouldRestoreFocus =
      restoreFocus && (this.isOpen() || this.isMenuRendered());

    this.isOpen.set(false);
    this.isMenuRendered.set(false);
    this.removeOutsideClickListener();
    this.cancelPendingTabClose();

    if (shouldRestoreFocus) {
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

      case 'Tab':
        this.closeAfterTabNavigation();
        break;
    }
  }

  onMenuFocusOut(event: FocusEvent): void {
    if (this.pendingTabClose) {
      return;
    }

    const menu = this.menu()?.nativeElement;
    const nextTarget = event.relatedTarget;

    if (nextTarget === this.trigger()?.nativeElement) {
      return;
    }

    if (
      menu &&
      nextTarget instanceof Node &&
      menu.contains(nextTarget)
    ) {
      return;
    }

    if (nextTarget instanceof Node) {
      this.close();
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
      currentIndex <= 0
        ? items.length - 1
        : currentIndex - 1;

    items[previousIndex].focus();
  }

  private getMenuItems(): HTMLButtonElement[] {
    return Array.from(
      this.menu()?.nativeElement.querySelectorAll<HTMLButtonElement>(
        '[role="menuitem"]'
      ) ?? []
    );
  }

  private closeAfterTabNavigation(): void {
    const window = this.document.defaultView;

    if (!window) {
      return;
    }

    this.cancelPendingTabClose();
    const generation = ++this.tabCloseGeneration;
    this.pendingTabClose = true;
    this.isOpen.set(false);
    this.removeOutsideClickListener();
    this.pendingTabCloseFrame = window.requestAnimationFrame(() => {
      if (generation !== this.tabCloseGeneration) {
        return;
      }

      this.pendingTabCloseFrame = null;
      this.pendingTabClose = false;

      if (!this.isMenuRendered()) {
        return;
      }

      const menu = this.menu()?.nativeElement;
      const activeElement = this.document.activeElement;

      if (menu?.contains(activeElement) && this.document.hasFocus()) {
        this.trigger()?.nativeElement.focus();
      }

      this.isMenuRendered.set(false);
    });
  }

  private cancelPendingTabClose(): void {
    this.tabCloseGeneration += 1;

    if (this.pendingTabCloseFrame === null) {
      this.pendingTabClose = false;
      return;
    }

    this.document.defaultView?.cancelAnimationFrame(
      this.pendingTabCloseFrame
    );
    this.pendingTabCloseFrame = null;
    this.pendingTabClose = false;
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
