import { test, expect } from '@playwright/test';

test('redireciona o acesso inicial para a tela de login', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/login\/?$/);

  await expect(
    page.getByRole('heading', { name: 'Entrar' }),
  ).toBeVisible();
});