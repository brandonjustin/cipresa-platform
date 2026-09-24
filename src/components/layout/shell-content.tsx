'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Navbar } from './navbar';
import { Footer } from './footer';
import { NavigationProgress } from './navigation-progress';

// Interactive overlays with no first-paint/SEO value — split into their own
// chunks so their JS (and framer-motion usage) loads on demand instead of
// bloating every page's initial bundle.
const SearchModal = dynamic(() => import('./search-modal').then((m) => m.SearchModal), { ssr: false });
const CartDrawer = dynamic(() => import('./cart-drawer').then((m) => m.CartDrawer), { ssr: false });
const AIChatbot = dynamic(() => import('../smart/ai-chatbot').then((m) => m.AIChatbot), { ssr: false });

export function ShellContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideUI = pathname.startsWith('/auth/') || pathname.includes('/learn');
  const isHomePage = pathname === '/';
  // The dashboard is an app-like workspace with its own sidebar: no marketing footer.
  const isDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard/');

  return (
    <>
      <NavigationProgress />
      {!hideUI && <Navbar />}
      {!hideUI && <SearchModal />}
      {!hideUI && <CartDrawer />}
      <main className="min-h-screen">{children}</main>
      {!hideUI && !isHomePage && <AIChatbot />}
      {!hideUI && !isDashboard && <Footer />}
    </>
  );
}
