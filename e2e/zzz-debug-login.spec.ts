import { test } from '@playwright/test';

test('debug login cookies', async ({ page }) => {
  page.on('console', (msg) => console.log('BROWSER:', msg.type(), msg.text()));
  page.on('pageerror', (err) => console.log('PAGEERROR:', err.message));
  page.on('response', (res) => {
    if (res.url().includes('supabase') || res.url().includes('/dashboard') || res.url().includes('/auth')) {
      console.log('RESPONSE', res.status(), res.url());
    }
  });

  await page.goto('/auth/login');
  await page.waitForLoadState('networkidle');
  await page.getByPlaceholder('votre@email.com').fill('student@cipresa.local');
  await page.getByPlaceholder('Votre mot de passe').fill('password123');

  await page.getByRole('button', { name: 'Se connecter' }).click();

  for (let i = 0; i < 10; i++) {
    await page.waitForTimeout(500);
    console.log(`t+${(i + 1) * 500}ms URL:`, page.url());
  }
});
