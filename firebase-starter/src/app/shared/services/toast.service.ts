import { Injectable, signal } from '@angular/core';

export type ToastType =
  | 'success'
  | 'info'
  | 'warning'
  | 'error';

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToastOptions {
  duration?: number | null;
}

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration: number | null;
}

interface ToastConfig {
  position: ToastPosition;
  maxVisible: number;
}

const TOAST_CONFIG: ToastConfig = {
  position: 'top-center',
  maxVisible: 5,
};

const DEFAULT_DURATIONS: Record<ToastType, number | null> = {
  success: 5000,
  info: 5000,
  warning: null,
  error: null,
};

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  private readonly _visibleToasts = signal<Toast[]>([]);
  private readonly _toastQueue = signal<Toast[]>([]);

  readonly visibleToasts = this._visibleToasts.asReadonly();
  readonly position = TOAST_CONFIG.position;

  success(
    message: string,
    options?: ToastOptions
  ): void {
    this.show('success', message, options);
  }

  info(
    message: string,
    options?: ToastOptions
  ): void {
    this.show('info', message, options);
  }

  warning(
    message: string,
    options?: ToastOptions
  ): void {
    this.show('warning', message, options);
  }

  error(
    message: string,
    options?: ToastOptions
  ): void {
    this.show('error', message, options);
  }

  show(
    type: ToastType,
    message: string,
    options?: ToastOptions
  ): void {
    const toast: Toast = {
      id: crypto.randomUUID(),
      type,
      message,
      duration:
        options?.duration ??
        DEFAULT_DURATIONS[type],
    };

    if (
      this._visibleToasts().length <
      TOAST_CONFIG.maxVisible
    ) {
      this._addVisibleToast(toast);
      return;
    }

    this._toastQueue.update(queue => [
      ...queue,
      toast,
    ]);
  }

  close(id: string): void {
    const wasVisible = this._visibleToasts()
      .some(toast => toast.id === id);

    if (wasVisible) {
      this._removeVisibleToast(id);
      this._promoteNextToast();
      return;
    }

    this._toastQueue.update(queue =>
      queue.filter(toast => toast.id !== id)
    );
  }

  private _addVisibleToast(toast: Toast): void {
    this._visibleToasts.update(toasts => [
      ...toasts,
      toast,
    ]);
  }

  private _removeVisibleToast(id: string): void {
    this._visibleToasts.update(toasts =>
      toasts.filter(toast => toast.id !== id)
    );
  }

  private _promoteNextToast(): void {
    const [nextToast, ...remainingQueue] =
      this._toastQueue();

    if (!nextToast) {
      return;
    }

    this._toastQueue.set(remainingQueue);
    this._addVisibleToast(nextToast);
  }
}