import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Defense-in-depth role check for admin server actions. Middleware already
 * blocks non-admins from *rendering* /admin/* pages, but server actions are
 * callable directly (e.g. from a stale client after a role downgrade), so
 * every admin mutation re-checks role here too.
 */
export async function requireAdmin() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Vous devez être connecté.');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
    throw new Error('Accès refusé.');
  }

  return user;
}
