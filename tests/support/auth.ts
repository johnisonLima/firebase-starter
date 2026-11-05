import 'dotenv/config';

import { expect, type Page } from '@playwright/test';

interface E2ECredentials {
  email: string;
  password: string;
}

function getE2ECredentials(): E2ECredentials {
  const email = process.env.E2E_USER_EMAIL;
  const password = process.env.E2E_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Configure E2E_USER_EMAIL e E2E_USER_PASSWORD no arquivo .env',
    );
  }

  return { email, password };
}

export async function login(page: Page): Promise<void> {
  const { email, password } = getE2ECredentials();

  await page.goto('/login');

  await page.getByLabel('E-mail', { exact: true }).fill(email);
  await page.getByLabel('Senha', { exact: true }).fill(password);

  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
}
