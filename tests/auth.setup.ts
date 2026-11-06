import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

import { expect, test as setup } from '@playwright/test';

import { AUTH_STATE_PATH, login } from './support/auth';

setup('autentica a conta E2E dedicada', async ({ page }) => {
  await login(page);

  await expect(
    page.getByRole('button', { name: 'Logout' }),
  ).toBeVisible();

  await mkdir(dirname(AUTH_STATE_PATH), { recursive: true });

  await page.context().storageState({ path: AUTH_STATE_PATH });
});
