'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { fetchCurrentUser } from '@/lib/auth/actions';
import { useAuthStore } from '@/lib/store/auth-store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setIsLoading = useAuthStore((s) => s.setIsLoading);

  useEffect(() => {
    let cancelled = false;

    fetchCurrentUser()
      .then((user) => {
        if (!cancelled) setUser(user);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        return;
      }
      // TOKEN_REFRESHED/INITIAL_SESSION fire on routine token rotation and on
      // mount (already covered by the fetchCurrentUser() call above) — only
      // a real sign-in or profile edit needs a fresh profile fetch.
      if (event !== 'SIGNED_IN' && event !== 'USER_UPDATED') return;

      setIsLoading(true);
      fetchCurrentUser()
        .then(setUser)
        .catch(() => setUser(null));
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
