import { supabase } from '@/lib/supabase/client';
import type { User } from '@/types';

function mapProfileToUser(id: string, email: string, profile: {
  full_name: string;
  avatar: string | null;
  role: User['role'];
  phone: string | null;
  location: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}): User {
  return {
    id,
    email,
    fullName: profile.full_name,
    avatar: profile.avatar ?? undefined,
    role: profile.role,
    phone: profile.phone ?? undefined,
    location: profile.location ?? undefined,
    bio: profile.bio ?? undefined,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
}

export async function fetchCurrentUser(): Promise<User | null> {
  // getSession() reads the local session (cookie/storage) with no network
  // call and never throws when logged out. auth.getUser() re-verifies with
  // the server but, called with no session at all (any anonymous visitor),
  // rejects internally with AuthSessionMissingError as a bare unhandled
  // promise rejection in the browser — separate from the promise this
  // function's own caller awaits/catches. Skip it entirely when there's
  // nothing to verify.
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return null;

  // Client-side display only (header name, avatar, role label): the session
  // user is enough and costs no network round trip. Anything security-relevant
  // is re-verified server-side (middleware auth.getUser() + RLS on every query),
  // and the profile query below is itself authorized by the token.
  const authUser = session.user;

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar, role, phone, location, bio, created_at, updated_at')
    .eq('id', authUser.id)
    .single();

  if (!profile) return null;

  return mapProfileToUser(authUser.id, authUser.email!, profile);
}

export async function signInWithPassword(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

/** Where the confirmation email link lands: the callback route exchanges the
 * code for a session, then continues on to `next` (only same-site paths). */
function confirmationRedirect(next?: string) {
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';
  return `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`;
}

export type SignUpOutcome = { status: 'signed-in' } | { status: 'confirm-email' };

export async function signUpWithPassword(params: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  next?: string;
}): Promise<SignUpOutcome> {
  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: { full_name: params.fullName, phone: params.phone },
      emailRedirectTo: confirmationRedirect(params.next),
    },
  });
  if (error) throw error;

  // With email confirmation on, Supabase doesn't error for an address that is
  // already registered (to avoid leaking which emails exist): it returns a user
  // with no identities instead.
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    throw new Error('Un compte existe déjà avec cet email. Connectez-vous ou réinitialisez votre mot de passe.');
  }

  // Email confirmation disabled: the account is active and signed in right away.
  return data.session ? { status: 'signed-in' } : { status: 'confirm-email' };
}

export async function resendSignUpConfirmation(email: string, next?: string) {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: confirmationRedirect(next) },
  });
  if (error) throw error;
}

export async function signOut() {
  await supabase.auth.signOut();
  window.location.href = '/';
}

export async function requestPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
  });
  if (error) throw error;
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}
