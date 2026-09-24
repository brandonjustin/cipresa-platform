import { test, expect } from '@playwright/test';

// Runs against static/marketing content only — no Supabase project required,
// so this is the one spec that should pass in any environment, including CI
// with no live backend configured.
test.describe('Marketing site smoke test', () => {
  test('homepage loads with hero and nav', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/CIPRESA/);
    await expect(page.getByRole('link', { name: /Formations/i }).first()).toBeVisible();
  });

  test('login page renders the form', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.getByPlaceholder('votre@email.com')).toBeVisible();
    await expect(page.getByPlaceholder('Votre mot de passe')).toBeVisible();
  });

  test('unauthenticated visitor is redirected away from the dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('unauthenticated visitor is redirected away from admin', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
