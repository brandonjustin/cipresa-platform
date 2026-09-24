import { createClient } from '@supabase/supabase-js';

/**
 * Cookie-free client for genuinely public, non-personalized reads (published
 * courses/products/blog posts/plants/learning paths — every RLS policy
 * gating these is `using (is_published = true)` with no role restriction, so
 * anon and authenticated requests see identical rows).
 *
 * Using this instead of createServerSupabaseClient() matters because that
 * client calls cookies() from next/headers — merely calling it, regardless
 * of whether the value is used, forces Next.js to treat the whole route as
 * dynamic (server-rendered on every request, no prefetch-and-cache). Reading
 * through this client instead lets these list/detail pages render as static
 * + ISR, so navigation to them is instant instead of a live round trip.
 */
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
