import { cache } from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';

// Cached per-request (see getCourseBySlug in courses.ts for the same
// pattern) — dozens of functions across src/lib/data each call this
// independently; without the cache they'd all rebuild the client (and
// re-invoke cookies()) from scratch for what's logically one request.
export const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component render, where cookies can't be
            // written — safe to ignore since middleware refreshes the
            // session on every request anyway.
          }
        },
      },
    }
  );
});

/**
 * Reads the user id middleware already verified via auth.getUser() for this
 * request (forwarded as the `x-user-id` header) instead of re-running that
 * network round trip in every Server Component that only needs the id — for
 * anything requiring the full user/session object, use
 * createServerSupabaseClient().auth.getUser() instead.
 */
export const getVerifiedUserId = (): string | null => headers().get('x-user-id') || null;
