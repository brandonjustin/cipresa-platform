import { test, expect } from '@playwright/test';

// Requires a live Supabase project — these pages fetch published courses/
// products server-side, which hangs against the placeholder .env.local URL
// (see smoke.spec.ts, which is deliberately scoped to backend-free pages).
const canRunAgainstLiveBackend = !!process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co');

test.describe('Catalog pages', () => {
  test.skip(!canRunAgainstLiveBackend, 'Requires a live Supabase project');

  test('courses catalog lists published courses', async ({ page }) => {
    await page.goto('/courses');
    await expect(page).toHaveURL(/\/courses/);
    await expect(page.getByText(/cours trouvés/)).toBeVisible();
  });

  test('marketplace lists published products', async ({ page }) => {
    await page.goto('/marketplace');
    await expect(page).toHaveURL(/\/marketplace/);
  });

  test('course detail page renders curriculum from the database', async ({ page }) => {
    await page.goto('/course/culture-de-tomate');
    await expect(page.getByRole('heading', { name: /Culture de la Tomate/i })).toBeVisible();
    await expect(page.getByText('Contenu du cours')).toBeVisible();
  });
});
