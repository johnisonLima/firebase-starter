import { computed, Injectable, signal, } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {

  private readonly _activeOperations = signal(0);

  readonly isLoading = computed(
    () => this._activeOperations() > 0
  );

  start(): void {
    this._activeOperations.update(
      count => count + 1
    );
  }

  stop(): void {
    this._activeOperations.update(
      count => Math.max(0, count - 1)
    );
  }
}