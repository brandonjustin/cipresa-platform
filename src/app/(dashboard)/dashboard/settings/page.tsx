import { redirect } from 'next/navigation';
import { createServerSupabaseClient, getVerifiedUserId } from '@/lib/supabase/server';
import { SettingsView } from '@/components/dashboard/settings-view';

export default async function SettingsPage() {
  // Middleware already verified the session for this route and forwarded the id.
  const userId = getVerifiedUserId();
  if (!userId) redirect('/auth/login?next=/dashboard/settings');

  const supabase = createServerSupabaseClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, avatar, phone, location, bio')
    .eq('id', userId)
    .single();

  // Only when the profile row has no email: read it from the session cookie
  // (getSession is local, no network round trip — the id was verified above).
  let email = profile?.email ?? '';
  if (!email) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    email = session?.user.email ?? '';
  }

  return (
    <SettingsView
      initialProfile={{
        fullName: profile?.full_name ?? '',
        email,
        avatar: profile?.avatar ?? '',
        phone: profile?.phone ?? '',
        location: profile?.location ?? '',
        bio: profile?.bio ?? '',
      }}
    />
  );
}
