import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isSidebarOpen: boolean;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  toggleSidebar: () => void;
  toggleCart: () => void;
  toggleSearch: () => void;
  toggleMobileMenu: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  closeAll: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarOpen: false,
      isCartOpen: false,
      isSearchOpen: false,
      isMobileMenuOpen: false,
      theme: 'system',
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen, isSearchOpen: false, isMobileMenuOpen: false })),
      toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen, isCartOpen: false, isMobileMenuOpen: false })),
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      setTheme: (theme) => set({ theme }),
      closeAll: () => set({ isSidebarOpen: false, isCartOpen: false, isSearchOpen: false, isMobileMenuOpen: false }),
    }),
    { name: 'cipresa-ui', partialize: (state) => ({ theme: state.theme }) }
  )
);
