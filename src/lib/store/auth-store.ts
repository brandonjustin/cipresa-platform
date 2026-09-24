import { create } from 'zustand';
import type { User } from '@/types';

/**
 * Client-side cache of the current Supabase session, for UI only (navbar
 * avatar, cart badge, etc). Never used for access control — that's always
 * enforced server-side (middleware + RLS). Populated by AuthProvider via
 * supabase.auth.getUser() + onAuthStateChange, not persisted to
 * localStorage: the real session already lives in Supabase's own cookies.
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
