import 'dotenv/config';

import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('redireciona para login quando não autenticado', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/login$/);
  });

  test('permite acesso após login', async ({ page }) => {
    await login(page);

    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('permite sair da conta', async ({ page }) => {
    await login(page);

    await expect(page).toHaveURL(/\/dashboard$/);

    await page.getByRole('button', { name: 'Logout' }).click();

    await expect(page).toHaveURL(/\/login$/);

    // Após o logout, a rota protegida não deve permanecer acessível.
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/login$/);
  });
});

async function login(page: import('@playwright/test').Page) {
  const email = process.env.E2E_USER_EMAIL;
  const password = process.env.E2E_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Configure E2E_USER_EMAIL e E2E_USER_PASSWORD no arquivo .env',
    );
  }

  await page.goto('/login');

  await page.getByRole('textbox', { name: 'E-mail' }).fill(email);
  await page.getByRole('textbox', { name: 'Senha' }).fill(password);

  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
}
