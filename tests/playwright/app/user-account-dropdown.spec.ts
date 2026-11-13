import { expect, test, type Page } from '@playwright/test';

import { mockFirebaseAuth, type FirebaseAuthMock } from '../support/firebase-auth-routes';

const DEFAULT_EMAIL = 'dropdown@example.com';
const trigger = (page: Page) => page.locator('app-user-account-dropdown').getByRole('button');

interface MockUser {
  email?: string;
  displayName?: string;
  photoUrl?: string;
}

async function signInAsMockUser(page: Page, user: MockUser = {}): Promise<FirebaseAuthMock> {
  const email = user.email ?? DEFAULT_EMAIL;
  const displayName = user.displayName ?? 'Dropdown User';
  const mock = await mockFirebaseAuth(page, {
    allow: ['signInWithPassword', 'lookup', 'tokenRefresh'],
    responses: {
      signInWithPassword: {
        body: {
          kind: 'identitytoolkit#VerifyPasswordResponse',
          localId: 'dropdown-user',
          email,
          displayName,
          idToken: 'mock-id-token',
          registered: true,
          refreshToken: 'mock-refresh-token',
          expiresIn: '3600',
        },
      },
      lookup: {
        body: {
          kind: 'identitytoolkit#GetAccountInfoResponse',
          users: [
            {
              localId: 'dropdown-user',
              email,
              displayName,
              photoUrl: user.photoUrl,
              emailVerified: true,
            },
          ],
        },
      },
    },
  });

  await page.goto('/login');
  await page.getByLabel('E-mail', { exact: true }).fill(email);
  await page.getByLabel('Senha', { exact: true }).fill('senha-e2e');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  return mock;
}

test.describe('UserAccountDropdown', () => {
  test('exibe nome e e-mail e omite avatar sem photoURL', async ({ page }) => {
    const mock = await signInAsMockUser(page);

    await expect(trigger(page)).toHaveText('Dropdown User');
    await trigger(page).click();
    await expect(page.getByText(DEFAULT_EMAIL, { exact: true })).toBeVisible();
    await expect(page.locator('app-user-account-dropdown img')).toHaveCount(0);

    mock.expectNoUnexpectedRequests();
  });

  test('usa o e-mail como fallback quando não existe nome', async ({ page }) => {
    const mock = await signInAsMockUser(page, { displayName: '' });

    await expect(trigger(page)).toHaveText(DEFAULT_EMAIL);
    mock.expectNoUnexpectedRequests();
  });

  test('exibe avatar quando existe photoURL', async ({ page }) => {
    const mock = await signInAsMockUser(page, {
      photoUrl: 'https://example.com/avatar.png',
    });

    await expect(page.locator('app-user-account-dropdown img')).toHaveCount(1);
    mock.expectNoUnexpectedRequests();
  });

  test('abre e fecha o menu pelo segundo clique no trigger', async ({ page }) => {
    const mock = await signInAsMockUser(page);
    const accountTrigger = trigger(page);

    await accountTrigger.click();
    await expect(page.getByRole('menu')).toBeVisible();

    await accountTrigger.click();
    await expect(page.getByRole('menu')).toBeHidden();
    mock.expectNoUnexpectedRequests();
  });

  test('fecha ao clicar fora do dropdown', async ({ page }) => {
    const mock = await signInAsMockUser(page);

    await trigger(page).click();
    await expect(page.getByRole('menu')).toBeVisible();
    await page.getByRole('button', { name: /Ativar tema/ }).click();

    await expect(page.getByRole('menu')).toBeHidden();
    mock.expectNoUnexpectedRequests();
  });

  test('fecha ao selecionar uma opção', async ({ page }) => {
    const mock = await signInAsMockUser(page);

    await trigger(page).click();
    await page.getByRole('menuitem', { name: 'Minha conta' }).click();

    await expect(page.getByRole('menu')).toBeHidden();
    mock.expectNoUnexpectedRequests();
  });

  test('Escape fecha o menu e restaura o foco ao trigger', async ({ page }) => {
    const mock = await signInAsMockUser(page);
    const accountTrigger = trigger(page);

    await accountTrigger.click();
    await expect(page.getByRole('menuitem', { name: 'Minha conta' })).toBeFocused();
    await page.keyboard.press('Escape');

    await expect(page.getByRole('menu')).toBeHidden();
    await expect(accountTrigger).toBeFocused();
    mock.expectNoUnexpectedRequests();
  });

  test('ArrowDown abre o menu e as setas navegam circularmente', async ({ page }) => {
    const mock = await signInAsMockUser(page);
    const accountTrigger = trigger(page);
    const first = page.getByRole('menuitem', { name: 'Minha conta' });
    const second = page.getByRole('menuitem', { name: 'Preferências' });
    const last = page.getByRole('menuitem', { name: 'Sair' });

    await accountTrigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(first).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(second).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(first).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(last).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(first).toBeFocused();

    mock.expectNoUnexpectedRequests();
  });

  test('ArrowUp abre no último item e Home e End movem o foco', async ({ page }) => {
    const mock = await signInAsMockUser(page);
    const accountTrigger = trigger(page);
    const first = page.getByRole('menuitem', { name: 'Minha conta' });
    const last = page.getByRole('menuitem', { name: 'Sair' });

    await accountTrigger.focus();
    await page.keyboard.press('ArrowUp');
    await expect(last).toBeFocused();

    await page.keyboard.press('Home');
    await expect(first).toBeFocused();
    await page.keyboard.press('End');
    await expect(last).toBeFocused();

    mock.expectNoUnexpectedRequests();
  });

  test('Tab fecha o menu sem manter foco em um item removido', async ({ page }) => {
    const mock = await signInAsMockUser(page);

    await trigger(page).click();
    await page.keyboard.press('End');
    await page.keyboard.press('Tab');

    await expect(page.getByRole('menu')).toBeHidden();
    await expect
      .poll(() => page.evaluate(() => document.activeElement?.closest('[role="menu"]') !== null))
      .toBe(false);
    mock.expectNoUnexpectedRequests();
  });

  test('Shift+Tab fecha o menu e move o foco de forma natural', async ({ page }) => {
    const mock = await signInAsMockUser(page);
    const accountTrigger = trigger(page);

    await accountTrigger.click();
    await page.keyboard.press('Shift+Tab');

    await expect(page.getByRole('menu')).toBeHidden();
    await expect(page.getByRole('button', { name: /Ativar tema/ })).toBeFocused();
    mock.expectNoUnexpectedRequests();
  });
});
