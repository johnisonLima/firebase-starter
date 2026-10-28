import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

const LOCAL_STORAGE_KEY = 'FS:THEME';

type ColorTheme = 'dark' | 'light';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  private readonly document = inject(DOCUMENT);

  readonly currentTheme = signal<ColorTheme>('light');

  constructor() {
    this.setColorTheme(this.getPreferredColorTheme(), false);
  }

  getPreferredColorTheme(): ColorTheme {
    return this._getStoredTheme() ?? 'light';
  }

  setColorTheme(
    colorTheme: ColorTheme,
    persist = true
  ): void {
    this.currentTheme.set(colorTheme);

    this.document.documentElement.classList.toggle(
      'dark',
      colorTheme === 'dark'
    );

    if (persist) {
      this._setStoredColorTheme(colorTheme);
    }
  }

  toggleColorTheme(): void {
    const nextTheme =
      this.currentTheme() === 'dark'
        ? 'light'
        : 'dark';

    this.setColorTheme(nextTheme);
  }

  private _getStoredTheme(): ColorTheme | undefined {
    if (typeof localStorage === 'undefined') {
      return undefined;
    }

    const storedThemeObject =
      localStorage.getItem(LOCAL_STORAGE_KEY);

    if (!storedThemeObject) {
      return undefined;
    }

    try {
      const parsed =
        JSON.parse(storedThemeObject);

      return parsed.colorTheme === 'dark' ||
        parsed.colorTheme === 'light'
        ? parsed.colorTheme
        : undefined;
    } catch {
      return undefined;
    }
  }

  private _setStoredColorTheme(
    colorTheme: ColorTheme
  ): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        colorTheme,
      })
    );
  }
}