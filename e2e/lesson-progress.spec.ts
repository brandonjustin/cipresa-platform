import { test, expect } from '@playwright/test';

// Requires a live Supabase project with supabase/seed.sql applied.
// student@cipresa.local is seeded with a free-course entitlement for
// "elevage-des-abeilles", so this exercises the entitlement gate + the
// lesson-complete server action without needing a real payment.
const canRunAgainstLiveBackend = !!process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co');

test.describe('Course learning flow', () => {
  test.skip(!canRunAgainstLiveBackend, 'Requires a live Supabase project with supabase/seed.sql applied');

  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByPlaceholder('votre@email.com').fill('student@cipresa.local');
    await page.getByPlaceholder('Votre mot de passe').fill('password123');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('entitled user can open the course player and mark a lesson complete', async ({ page }) => {
    await page.goto('/course/elevage-des-abeilles/learn');
    await expect(page).toHaveURL(/\/course\/elevage-des-abeilles\/learn/);

    const markCompleteButton = page.locator('button[title="Marquer comme terminé"]');
    await expect(markCompleteButton).toBeVisible();
    await markCompleteButton.click();

    await expect(page.locator('button[title="Marquer comme non terminé"]')).toBeVisible();
  });

  test('non-entitled user is redirected away from the learn page to the sales page', async ({ page }) => {
    // gestion-des-exploitations-agricoles is a paid course the seeded student never purchased
    await page.goto('/course/gestion-des-exploitations-agricoles/learn');
    await expect(page).toHaveURL(/\/course\/gestion-des-exploitations-agricoles$/);
  });
});
