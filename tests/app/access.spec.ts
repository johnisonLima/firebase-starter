import { test, expect } from '@playwright/test';

test('acessa a aplicação', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/localhost:4200/);
});