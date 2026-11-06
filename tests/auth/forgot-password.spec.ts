import { test, expect } from '@playwright/test';

import {
  firebaseAuthError,
  mockFirebaseAuth,
} from '../support/firebase-auth-routes';

const SUCCESS_MESSAGE =
  'Se existir uma conta com este e-mail, enviaremos as instruções para redefinição de senha.';

test.describe('Recuperação de senha', () => {
  test('acessa a tela e valida o campo de e-mail', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('link', { name: 'Esqueci minha senha' }).click();

    await expect(page).toHaveURL(/\/forgot-password$/);
    await expect(
      page.getByRole('heading', { name: 'Recuperar senha' }),
    ).toBeVisible();

    const submit = page.getByRole('button', { name: 'Enviar instruções' });

    await expect(submit).toBeDisabled();

    const email = page.getByLabel('E-mail', { exact: true });

    await email.focus();
    await email.blur();
    await expect(page.getByText('E-mail é obrigatório.')).toBeVisible();

    await email.fill('email-invalido');
    await email.blur();
    await expect(page.getByText('E-mail inválido.')).toBeVisible();
  });

  test('envia a solicitação simulada e exibe a mensagem de sucesso', async ({
    page,
  }) => {
    const mock = await mockFirebaseAuth(page, {
      allow: ['sendPasswordResetEmail'],
    });

    await page.goto('/forgot-password');

    await page
      .getByLabel('E-mail', { exact: true })
      .fill('e2e@example.com');

    await page.getByRole('button', { name: 'Enviar instruções' }).click();

    await expect(page.getByText(SUCCESS_MESSAGE)).toBeVisible();

    expect(mock.handledOperations).toEqual(['sendPasswordResetEmail']);
    mock.expectNoUnexpectedRequests();
  });

  test('exibe erro retornado pelo Firebase', async ({ page }) => {
    const mock = await mockFirebaseAuth(page, {
      allow: ['sendPasswordResetEmail'],
      responses: {
        sendPasswordResetEmail: firebaseAuthError(
          'TOO_MANY_ATTEMPTS_TRY_LATER',
        ),
      },
    });

    await page.goto('/forgot-password');

    await page
      .getByLabel('E-mail', { exact: true })
      .fill('e2e@example.com');

    await page.getByRole('button', { name: 'Enviar instruções' }).click();

    await expect(
      page.getByText('Muitas tentativas. Tente novamente mais tarde.'),
    ).toBeVisible();
    await expect(page.getByText(SUCCESS_MESSAGE)).toBeHidden();

    expect(mock.handledOperations).toEqual(['sendPasswordResetEmail']);
    mock.expectNoUnexpectedRequests();
  });
});
