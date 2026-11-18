import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

import { expect, test as setup } from '@playwright/test';

import { AUTH_STATE_PATH, login } from './support/auth';

setup('autentica a conta E2E dedicada', async ({ page }) => {
  await login(page);

  await expect(page.locator('app-user-account-dropdown').getByRole('button')).toBeVisible();

  await mkdir(dirname(AUTH_STATE_PATH), { recursive: true });

  await page.context().storageState({ path: AUTH_STATE_PATH });
});
