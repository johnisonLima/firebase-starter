import { test, expect } from '@playwright/test';

test.describe('Playground', () => {
  test('redireciona para login quando não autenticado', async ({ page }) => {
    await page.goto('/playground');

    await expect(page).toHaveURL(/\/login$/);
  });
});
