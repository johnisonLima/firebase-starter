import { test, expect } from '@playwright/test';

import {
  firebaseAuthError,
  mockFirebaseAuth,
} from '../support/firebase-auth-routes';

const UNVERIFIED_LOOKUP = {
  kind: 'identitytoolkit#GetAccountInfoResponse',
  users: [
    {
      localId: 'e2e-user',
      email: 'e2e@example.com',
      emailVerified: false,
    },
  ],
};

test.describe('Cadastro', () => {
  test('exibe a tela e valida os campos obrigatórios', async ({ page }) => {
    await page.goto('/register');

    await expect(
      page.getByRole('heading', { name: 'Criar conta' }),
    ).toBeVisible();

    const submit = page.getByRole('button', { name: 'Criar conta' });

    await expect(submit).toBeDisabled();

    await page.getByLabel('E-mail', { exact: true }).focus();
    await page.getByLabel('E-mail', { exact: true }).blur();
    await expect(page.getByText('E-mail é obrigatório.')).toBeVisible();

    await page.getByLabel('Senha', { exact: true }).focus();
    await page.getByLabel('Senha', { exact: true }).blur();
    await expect(page.getByText('Senha é obrigatório.')).toBeVisible();

    await page.getByLabel('Confirmar senha', { exact: true }).focus();
    await page.getByLabel('Confirmar senha', { exact: true }).blur();
    await expect(
      page.getByText('Confirmação de senha é obrigatório.'),
    ).toBeVisible();
  });

  test('valida e-mail, tamanho da senha e confirmação', async ({ page }) => {
    await page.goto('/register');

    const email = page.getByLabel('E-mail', { exact: true });
    const password = page.getByLabel('Senha', { exact: true });
    const confirmPassword = page.getByLabel('Confirmar senha', {
      exact: true,
    });

    await email.fill('email-invalido');
    await email.blur();
    await expect(page.getByText('E-mail inválido.')).toBeVisible();

    await password.fill('123');
    await password.blur();
    await expect(
      page.getByText('Senha deve possuir no mínimo 6 caracteres.'),
    ).toBeVisible();

    await confirmPassword.fill('senha-diferente');
    await confirmPassword.blur();
    await expect(
      page.getByText('Os valores informados não coincidem.'),
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Criar conta' }),
    ).toBeDisabled();
  });

  test('cadastra com sucesso e redireciona para verificação de e-mail', async ({
    page,
  }) => {
    const mock = await mockFirebaseAuth(page, {
      allow: ['signUp', 'lookup', 'sendEmailVerification'],
      responses: {
        lookup: { body: UNVERIFIED_LOOKUP },
      },
    });

    await page.goto('/register');

    await page
      .getByLabel('E-mail', { exact: true })
      .fill('e2e@example.com');
    await page
      .getByLabel('Senha', { exact: true })
      .fill('senha-segura');
    await page
      .getByLabel('Confirmar senha', { exact: true })
      .fill('senha-segura');

    await page.getByRole('button', { name: 'Criar conta' }).click();

    await expect(page).toHaveURL(/\/verify-email$/);
    await expect(
      page.getByRole('heading', { name: 'Verifique seu e-mail' }),
    ).toBeVisible();
    await expect(page.getByText('e2e@example.com')).toBeVisible();

    expect(mock.handledOperations).toEqual([
      'signUp',
      'lookup',
      'sendEmailVerification',
    ]);
    mock.expectNoUnexpectedRequests();
  });

  test('exibe erro retornado pelo Firebase e permanece no cadastro', async ({
    page,
  }) => {
    const mock = await mockFirebaseAuth(page, {
      allow: ['signUp'],
      responses: {
        signUp: firebaseAuthError('EMAIL_EXISTS'),
      },
    });

    await page.goto('/register');

    await page
      .getByLabel('E-mail', { exact: true })
      .fill('e2e@example.com');
    await page
      .getByLabel('Senha', { exact: true })
      .fill('senha-segura');
    await page
      .getByLabel('Confirmar senha', { exact: true })
      .fill('senha-segura');

    await page.getByRole('button', { name: 'Criar conta' }).click();

    await expect(
      page.getByText('Este e-mail já está em uso.'),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/register$/);

    expect(mock.handledOperations).toEqual(['signUp']);
    mock.expectNoUnexpectedRequests();
  });
});
