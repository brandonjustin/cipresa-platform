import { test, expect } from '@playwright/test';

// Requires a live Supabase project with supabase/seed.sql applied (gives us
// student@cipresa.local / password123 — see supabase/seed.sql). Skipped
// automatically if the app isn't pointed at a real project, since login
// will just fail against the placeholder .env.local values otherwise.
const canRunAgainstLiveBackend = !!process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co');

test.describe('Authentication', () => {
  test.skip(!canRunAgainstLiveBackend, 'Requires a live Supabase project with supabase/seed.sql applied');

  test('a seeded user can log in and reach the dashboard', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByPlaceholder('votre@email.com').fill('student@cipresa.local');
    await page.getByPlaceholder('Votre mot de passe').fill('password123');
    await page.getByRole('button', { name: 'Se connecter' }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('Tableau de bord')).toBeVisible();
  });

  test('wrong password shows an error and stays on the login page', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByPlaceholder('votre@email.com').fill('student@cipresa.local');
    await page.getByPlaceholder('Votre mot de passe').fill('wrong-password');
    await page.getByRole('button', { name: 'Se connecter' }).click();

    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.locator('text=/incorrect|invalid/i')).toBeVisible();
  });

  test('logged-in user can log out from the dashboard', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByPlaceholder('votre@email.com').fill('student@cipresa.local');
    await page.getByPlaceholder('Votre mot de passe').fill('password123');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    await page.getByRole('button', { name: 'Déconnexion' }).click();
    await expect(page).toHaveURL('/');
  });
});
