import { test, expect } from '@playwright/test';

import { AUTH_STATE_PATH, login } from '../support/auth';

// Evita capturar credenciais e tokens de sessão em traces.
test.use({ trace: 'off' });

test.describe('Dashboard', () => {
  test('redireciona para login quando não autenticado', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/login$/);
  });

  test.describe('sessão preparada pelo setup', { tag: '@authenticated' }, () => {
    test.use({ storageState: AUTH_STATE_PATH });

    test('reutiliza a sessão após reload e permite sair da conta', async ({ page }) => {
      await page.goto('/dashboard');

      await expect(page.locator('app-user-account-dropdown').getByRole('button')).toBeVisible();

      await page.reload();

      await expect(page.getByText('dashboard works!', { exact: true })).toBeVisible();

      await page.locator('app-user-account-dropdown').getByRole('button').click();

      await page.getByRole('menuitem', { name: 'Sair' }).click();

      await expect(page).toHaveURL(/\/login$/);

      // Após o logout, a rota protegida não deve permanecer acessível.
      await page.goto('/dashboard');

      await expect(page).toHaveURL(/\/login$/);
    });
  });

  test.describe('login real', { tag: '@authenticated' }, () => {
    test('permite acesso após login', async ({ page }) => {
      await login(page);

      await expect(page.getByText('dashboard works!', { exact: true })).toBeVisible();

      await expect(page.locator('app-user-account-dropdown').getByRole('button')).toBeVisible();
    });
  });
});
