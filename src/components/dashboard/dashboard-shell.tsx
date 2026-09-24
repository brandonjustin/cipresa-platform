'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, ShoppingBag, Heart, Award,
  BarChart3, Settings, LogOut, Menu, X, ArrowUpRight,
} from 'lucide-react';
import { PageTransition } from '@/components/animations/motion-components';
import { NotificationBell } from '@/components/layout/notification-bell';
import { cn } from '@/lib/utils/cn';
import { useAuthStore } from '@/lib/store/auth-store';
import { signOut } from '@/lib/auth/actions';
import { getInitials } from '@/lib/utils/format';

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Tableau de bord', href: '/dashboard' },
  { icon: BookOpen, label: 'Mes cours', href: '/dashboard/my-courses' },
  { icon: Award, label: 'Mes certificats', href: '/dashboard/certificates' },
  { icon: ShoppingBag, label: 'Mes commandes', href: '/dashboard/orders' },
  { icon: Heart, label: 'Liste de souhaits', href: '/dashboard/wishlist' },
  { icon: BarChart3, label: 'Analytiques', href: '/dashboard/analytics' },
  { icon: Settings, label: 'Paramètres', href: '/dashboard/settings' },
];

const pageTitles: Record<string, string> = {
  '/dashboard': 'Tableau de bord',
  '/dashboard/my-courses': 'Mes cours',
  '/dashboard/orders': 'Mes commandes',
  '/dashboard/wishlist': 'Liste de souhaits',
  '/dashboard/analytics': 'Analytiques',
  '/dashboard/settings': 'Paramètres',
  '/dashboard/certificates': 'Mes certificats',
};

const roleLabels: Record<string, string> = {
  student: 'Étudiant',
  instructor: 'Formateur',
  admin: 'Administrateur',
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const title = pageTitles[pathname] ?? 'Tableau de bord';
  const isHome = pathname === '/dashboard';
  const firstName = user?.fullName?.split(' ')[0];

  const isActive = (href: string) => (href === '/dashboard' ? pathname === href : pathname.startsWith(href));

  const sidebarContent = (onClose?: () => void) => (
    <>
      <div className="relative overflow-hidden bg-[#ff7a3d] p-5 text-white">
        <div
          aria-hidden="true"
          className="absolute -bottom-16 -right-10 h-[140px] w-[140px] rounded-full border border-white/35 opacity-70"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '10px 10px' }}
        />
        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[14px] font-bold text-[#ff7a3d]">
            {getInitials(user?.fullName || 'Utilisateur')}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold leading-tight">{user?.fullName || 'Utilisateur'}</p>
            <span className="mt-1 inline-block bg-white/20 px-2 py-0.5 text-[11px] font-semibold leading-none">
              {roleLabels[user?.role ?? 'student'] ?? 'Étudiant'}
            </span>
          </div>
        </div>
      </div>

      <nav className="mt-4 flex-1 space-y-0.5" aria-label="Espace personnel">
        {sidebarLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'group relative flex items-center gap-3 px-4 py-3 text-[13px] font-semibold transition-colors duration-300',
                active ? 'bg-black text-white' : 'text-black/65 hover:bg-[#f6f5f2] hover:text-black'
              )}
            >
              <span className={cn('absolute inset-y-0 left-0 w-[3px] bg-[#ff7a3d] transition-opacity', active ? 'opacity-100' : 'opacity-0')} />
              <link.icon className={cn('h-4 w-4 shrink-0', active ? 'text-[#ff7a3d]' : 'text-black/45 group-hover:text-black')} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
        <Link
          href="/courses"
          onClick={onClose}
          className="group flex items-center justify-between bg-[#f6f5f2] px-4 py-3 text-[13px] font-semibold text-black transition-colors hover:bg-black hover:text-white"
        >
          Explorer les formations
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
        </Link>
        <button
          type="button"
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 px-4 py-3 text-[13px] font-semibold text-red-500 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" /> Déconnexion
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f6f5f2] pt-[60px] font-[var(--font-poppins)] lg:flex">
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed left-0 top-[60px] z-50 flex h-[calc(100vh-60px)] w-72 flex-col overflow-y-auto bg-white p-4 lg:hidden"
            >
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Fermer le menu"
                className="mb-3 flex h-9 w-9 items-center justify-center self-end rounded-full border border-black/15 text-black transition-colors hover:bg-black hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
              {sidebarContent(() => setMobileMenuOpen(false))}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside className="sticky top-[60px] hidden h-[calc(100vh-60px)] w-72 shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white p-4 lg:flex">
        {sidebarContent()}
      </aside>

      <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-8 flex items-end justify-between gap-4 border-b border-black pb-5">
            <div className="flex items-end gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Ouvrir le menu"
                className="flex h-10 w-10 items-center justify-center bg-white text-black ring-1 ring-black/10 transition-colors hover:bg-black hover:text-white lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                {isHome && (
                  <p className="text-[13px] font-medium text-black/55">
                    Bienvenue{firstName ? `, ${firstName}` : ''} 👋
                  </p>
                )}
                <h1 className="font-display text-[28px] font-medium leading-[1] text-black sm:text-[36px]">{title}</h1>
              </div>
            </div>
            <NotificationBell />
          </div>

          <PageTransition>{children}</PageTransition>
        </div>
      </main>
    </div>
  );
}
