import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/dashboard'];
const ADMIN_PREFIXES = ['/admin'];
// Public routes that personalize content for a logged-in visitor (wishlist
// heart, entitlement/progress state) via getVerifiedUserId() — they don't
// gate access, but still need the verified id.
const PERSONALIZED_PREFIXES = ['/course/', '/paths/', '/plant/', '/product/'];

function needsSession(pathname: string): boolean {
  return (
    PROTECTED_PREFIXES.some((p) => pathname.startsWith(p)) ||
    ADMIN_PREFIXES.some((p) => pathname.startsWith(p)) ||
    PERSONALIZED_PREFIXES.some((p) => pathname.startsWith(p))
  );
}

/**
 * Refreshes the Supabase session cookie (required by @supabase/ssr so server
 * components always see a valid/expired-checked session) and enforces route
 * protection for /dashboard and /admin.
 *
 * Also forwards the verified user id downstream via the `x-user-id` request
 * header, so pages that only need the id (wishlist/entitlement lookups) can
 * read it instead of re-running their own auth.getUser() network round trip
 * for a check middleware already just did.
 *
 * The Supabase auth network round trip only runs for routes that actually
 * consume the result (above) — plain public pages (blog, course/product
 * lists, static content) skip it entirely and pass straight through. This
 * is safe: nothing on those pages reads the session, and not refreshing the
 * cookie there doesn't invalidate anything — the refresh token isn't
 * consumed by going unused, it just refreshes next time the user hits a
 * route that does need it.
 */
/** Supabase stores the session as `sb-<project-ref>-auth-token` (possibly
 * chunked as `...-auth-token.0`, `.1`, …). No such cookie = anonymous. */
function hasAuthCookie(request: NextRequest): boolean {
  return request.cookies.getAll().some((c) => c.name.startsWith('sb-') && c.name.includes('-auth-token'));
}

/** Always overwrite x-user-id so a client can never spoof it by sending the header itself. */
function passThrough(request: NextRequest, userId = '') {
  request.headers.set('x-user-id', userId);
  return NextResponse.next({ request });
}

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!needsSession(pathname)) {
    return passThrough(request);
  }

  const needsAuth = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const needsAdmin = ADMIN_PREFIXES.some((p) => pathname.startsWith(p));

  // Anonymous visitor (no session cookie at all): there is nothing to verify,
  // so skip the Supabase network round trip entirely. Protected routes go
  // straight to login; personalized public pages render the anonymous view.
  if (!hasAuthCookie(request)) {
    if (needsAuth || needsAdmin) {
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return passThrough(request);
  }

  const cookiesToApply: { name: string; value: string; options: CookieOptions }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToApply.push(...cookiesToSet);
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if ((needsAuth || needsAdmin) && !user) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (needsAdmin && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  request.headers.set('x-user-id', user?.id ?? '');
  const response = NextResponse.next({ request });
  cookiesToApply.forEach(({ name, value, options }) => response.cookies.set(name, value, options));

  return response;
}
