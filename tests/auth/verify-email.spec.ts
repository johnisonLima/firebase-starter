import { test, expect, type Page } from '@playwright/test';

import {
  firebaseAuthError,
  mockFirebaseAuth,
  type FirebaseAuthMock,
  type FirebaseAuthMockResponse,
  type FirebaseAuthOperation,
} from '../support/firebase-auth-routes';

const USER_EMAIL = 'e2e@example.com';

const UNVERIFIED_LOOKUP = {
  kind: 'identitytoolkit#GetAccountInfoResponse',
  users: [
    {
      localId: 'e2e-user',
      email: USER_EMAIL,
      emailVerified: false,
    },
  ],
};

const VERIFIED_LOOKUP = {
  kind: 'identitytoolkit#GetAccountInfoResponse',
  users: [
    {
      localId: 'e2e-user',
      email: USER_EMAIL,
      emailVerified: true,
    },
  ],
};

interface SignInOptions {
  extraOperations?: FirebaseAuthOperation[];
  responses?: Partial<Record<FirebaseAuthOperation, FirebaseAuthMockResponse>>;
}

/**
 * Estabelece uma sessão autenticada com e-mail não verificado usando o login
 * real da interface e respostas simuladas de `signInWithPassword` e `lookup`.
 */
async function signInWithUnverifiedUser(
  page: Page,
  options: SignInOptions = {},
): Promise<FirebaseAuthMock> {
  const mock = await mockFirebaseAuth(page, {
    allow: [
      'signInWithPassword',
      'lookup',
      ...(options.extraOperations ?? []),
    ],
    responses: {
      lookup: { body: UNVERIFIED_LOOKUP },
      ...options.responses,
    },
  });

  await page.goto('/login');

  await page.getByLabel('E-mail', { exact: true }).fill(USER_EMAIL);
  await page.getByLabel('Senha', { exact: true }).fill('senha-e2e');

  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page).toHaveURL(/\/verify-email$/);
  await expect(
    page.getByRole('heading', { name: 'Verifique seu e-mail' }),
  ).toBeVisible();

  return mock;
}

test.describe('Verificação de e-mail', () => {
  test('protege a rota para usuários não autenticados', async ({ page }) => {
    await page.goto('/verify-email');

    await expect(page).toHaveURL(/\/login$/);
  });

  test('exibe a página para usuário autenticado não verificado', async ({
    page,
  }) => {
    const mock = await signInWithUnverifiedUser(page);

    await expect(page.getByText(USER_EMAIL)).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Já verifiquei meu e-mail' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Reenviar e-mail' }),
    ).toBeVisible();

    expect(mock.handledOperations).toEqual([
      'signInWithPassword',
      'lookup',
    ]);
    mock.expectNoUnexpectedRequests();
  });

  test('permanece na página quando o e-mail ainda não foi confirmado', async ({
    page,
  }) => {
    const mock = await signInWithUnverifiedUser(page);

    const checkButton = page.getByRole('button', {
      name: 'Já verifiquei meu e-mail',
    });

    await checkButton.click();

    await expect(checkButton).toBeEnabled();
    await expect(page).toHaveURL(/\/verify-email$/);
    await expect(
      page.getByRole('heading', { name: 'Verifique seu e-mail' }),
    ).toBeVisible();

    expect(mock.handledOperations).toEqual([
      'signInWithPassword',
      'lookup',
      'lookup',
    ]);
    mock.expectNoUnexpectedRequests();
  });

  test('redireciona ao dashboard quando a verificação é confirmada', async ({
    page,
  }) => {
    const mock = await signInWithUnverifiedUser(page);

    mock.setResponse('lookup', { body: VERIFIED_LOOKUP });

    await page
      .getByRole('button', { name: 'Já verifiquei meu e-mail' })
      .click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(
      page.getByText('dashboard works!', { exact: true }),
    ).toBeVisible();

    expect(mock.handledOperations).toEqual([
      'signInWithPassword',
      'lookup',
      'lookup',
    ]);
    mock.expectNoUnexpectedRequests();
  });

  test('mantém a página e libera o botão quando a consulta falha', async ({
    page,
  }) => {
    const mock = await signInWithUnverifiedUser(page);

    mock.setResponse('lookup', firebaseAuthError('INTERNAL_ERROR'));

    const checkButton = page.getByRole('button', {
      name: 'Já verifiquei meu e-mail',
    });

    await checkButton.click();

    await expect(checkButton).toBeEnabled();
    await expect(page).toHaveURL(/\/verify-email$/);
    await expect(
      page.getByRole('heading', { name: 'Verifique seu e-mail' }),
    ).toBeVisible();

    expect(mock.handledOperations).toEqual([
      'signInWithPassword',
      'lookup',
      'lookup',
    ]);
    mock.expectNoUnexpectedRequests();
  });

  test('reenvia o e-mail de verificação com sucesso', async ({ page }) => {
    const mock = await signInWithUnverifiedUser(page, {
      extraOperations: ['sendEmailVerification'],
    });

    await page.getByRole('button', { name: 'Reenviar e-mail' }).click();

    await expect(page.getByRole('status')).toHaveText(
      'E-mail de verificação reenviado com sucesso. Verifique sua caixa de entrada.',
    );

    expect(mock.handledOperations).toEqual([
      'signInWithPassword',
      'lookup',
      'sendEmailVerification',
    ]);
    mock.expectNoUnexpectedRequests();
  });

  test('exibe erro quando o reenvio falha', async ({ page }) => {
    const mock = await signInWithUnverifiedUser(page, {
      extraOperations: ['sendEmailVerification'],
      responses: {
        sendEmailVerification: firebaseAuthError(
          'TOO_MANY_ATTEMPTS_TRY_LATER',
        ),
      },
    });

    await page.getByRole('button', { name: 'Reenviar e-mail' }).click();

    await expect(page.getByRole('status')).toHaveText(
      'Não foi possível reenviar o e-mail de verificação. Tente novamente.',
    );

    expect(mock.handledOperations).toEqual([
      'signInWithPassword',
      'lookup',
      'sendEmailVerification',
    ]);
    mock.expectNoUnexpectedRequests();
  });
});
