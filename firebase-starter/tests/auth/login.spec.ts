import 'dotenv/config';

import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test.describe.configure({ mode: 'serial' });

  test('exibe a tela de login', async ({ page }) => {
    await page.goto('/login');

    await expect(
      page.getByRole('heading', { name: 'Entrar' })
    ).toBeVisible();

    await expect(
      page.getByRole('textbox', { name: 'E-mail' })
    ).toBeVisible();

    await expect(
      page.getByRole('textbox', { name: 'Senha' })
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Entrar' })
    ).toBeVisible();
  });

  test('permite acessar o cadastro', async ({ page }) => {
    await page.goto('/login');

    const registerLink = page.getByRole('link', { name: 'Criar conta' });

    await expect(registerLink).toBeVisible();

    await registerLink.click();

    await page.waitForURL('**/register');

    await expect(page).toHaveURL(/\/register$/);

    });

  test('permite entrar com uma conta válida', async ({ page }) => {
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

    // Ajuste a rota para a área autenticada real do projeto.
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('permite sair da conta', async ({ page }) => {
    
    await login(page);

    await page.getByRole('button', { name: 'Logout' }).click();

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