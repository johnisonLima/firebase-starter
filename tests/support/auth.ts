import 'dotenv/config';

import { expect, type Page } from '@playwright/test';

/**
 * Estado de autenticação preparado pelo projeto `setup` e reutilizado apenas
 * pelos cenários que não precisam validar o fluxo de login.
 *
 * O arquivo fica em `test-results/`, que é ignorado pelo Git e não é publicado
 * como artefato no CI.
 */
export const AUTH_STATE_PATH = 'test-results/auth-state.json';

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
