import { test, expect } from '@playwright/test';

import { AUTH_STATE_PATH } from '../support/auth';
import {
  firebaseAuthError,
  mockFirebaseAuth,
} from '../support/firebase-auth-routes';

// Evita capturar o estado de autenticação real em traces de retry.
test.use({ trace: 'off' });

test.describe('Login', () => {
  test('exibe a tela de login', async ({ page }) => {
    await page.goto('/login');

    await expect(
      page.getByRole('heading', { name: 'Entrar' }),
    ).toBeVisible();

    await expect(
      page.getByLabel('E-mail', { exact: true }),
    ).toBeVisible();

    await expect(
      page.getByLabel('Senha', { exact: true }),
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Entrar' }),
    ).toBeVisible();
  });

  test('permite acessar o cadastro', async ({ page }) => {
    await page.goto('/login');

    const registerLink = page.getByRole('link', { name: 'Criar conta' });

    await expect(registerLink).toBeVisible();

    await registerLink.click();

    await expect(page).toHaveURL(/\/register$/);
  });

  test('exibe erro para credenciais inválidas e permanece no login', async ({
    page,
  }) => {
    const mock = await mockFirebaseAuth(page, {
      allow: ['signInWithPassword'],
      responses: {
        signInWithPassword: firebaseAuthError('INVALID_LOGIN_CREDENTIALS'),
      },
    });

    await page.goto('/login');
    await page.getByLabel('E-mail', { exact: true }).fill('e2e@example.com');
    await page.getByLabel('Senha', { exact: true }).fill('senha-incorreta');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByText('E-mail ou senha inválidos.')).toBeVisible();

    expect(mock.handledOperations).toEqual(['signInWithPassword']);
    mock.expectNoUnexpectedRequests();
  });

  test.describe('usuário autenticado', { tag: '@authenticated' }, () => {
    test.use({ storageState: AUTH_STATE_PATH });

    test('redireciona login e cadastro para o dashboard', async ({ page }) => {
      await page.goto('/login');

      await expect(page).toHaveURL(/\/dashboard$/);

      await page.goto('/register');

      await expect(page).toHaveURL(/\/dashboard$/);
    });
  });
});
