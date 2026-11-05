import { test, expect } from '@playwright/test';

import { login } from '../support/auth';

test.describe('Dashboard', () => {
  test('redireciona para login quando não autenticado', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/login$/);
  });

  test('permite acesso após login', async ({ page }) => {
    await login(page);

    await expect(
      page.getByText('dashboard works!', { exact: true }),
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Logout' }),
    ).toBeVisible();
  });

  test('permite sair da conta', async ({ page }) => {
    await login(page);

    await expect(
      page.getByRole('button', { name: 'Logout' }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Logout' }).click();

    await expect(page).toHaveURL(/\/login$/);

    // Após o logout, a rota protegida não deve permanecer acessível.
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/login$/);
  });
});
