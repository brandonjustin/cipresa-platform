import { test, expect } from '@playwright/test';

// Requires a live Supabase project with supabase/seed.sql applied (gives us
// student@cipresa.local / password123 — see supabase/seed.sql). Skipped
// automatically if the app isn't pointed at a real project.
const canRunAgainstLiveBackend = !!process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co');

test.describe('Dashboard', () => {
  test.skip(!canRunAgainstLiveBackend, 'Requires a live Supabase project with supabase/seed.sql applied');

  test('shows correct enrollment stats for a student with mixed progress', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByPlaceholder('votre@email.com').fill('student@cipresa.local');
    await page.getByPlaceholder('Votre mot de passe').fill('password123');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });

    await expect(page.getByText('Bienvenue, Jean')).toBeVisible();

    // Seeded student has one completed course (Culture de la Tomate) and one
    // still in progress (Élevage des Abeilles) — the stats grid, not the
    // new-user welcome hero, must render, and the in-progress course must
    // appear under "Continuer l'apprentissage" while the completed one
    // shouldn't be double-counted there.
    await expect(page.getByText('Cours en cours')).toBeVisible();
    await expect(page.getByText('Cours terminés')).toBeVisible();
    await expect(page.getByText('Bienvenue sur CIPRESA')).not.toBeVisible();

    const continueSection = page.locator('text=Continuer l\'apprentissage').locator('..').locator('..');
    await expect(continueSection.getByText('Élevage des Abeilles')).toBeVisible();

    // Recommandations must exclude courses already enrolled in/completed —
    // suggesting Culture de la Tomate back to Jean would be a broken recommendation.
    await expect(page.getByText('Culture de la Tomate')).not.toBeVisible();
    await expect(page.getByText('Gestion des Exploitations Agricoles')).toBeVisible();
  });
});
