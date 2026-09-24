'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, ShoppingBag, Users, Leaf,
  BarChart3, Settings, LogOut, Menu, X, Receipt, Newspaper,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { signOut } from '@/lib/auth/actions';

const adminSidebar = [
  { icon: LayoutDashboard, label: "Vue d'ensemble", href: '/admin' },
  { icon: BookOpen, label: 'Gestion cours', href: '/admin/courses' },
  { icon: ShoppingBag, label: 'Produits', href: '/admin/products' },
  { icon: Receipt, label: 'Commandes', href: '/admin/orders' },
  { icon: Newspaper, label: 'Blog', href: '/admin/blog' },
  { icon: Leaf, label: 'Encyclopédie', href: '/admin/encyclopedia' },
  { icon: Users, label: 'Utilisateurs', href: '/admin/users' },
  { icon: BarChart3, label: 'Analytiques', href: '/admin/analytics' },
  { icon: Settings, label: 'Paramètres', href: '/admin/settings' },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));

  const nav = (onClick?: () => void) => (
    <nav className="flex-1 space-y-1">
      {adminSidebar.map((link) => (
        <Link key={link.label} href={link.href} onClick={onClick}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
            isActive(link.href) ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
          )}>
          <link.icon className="w-5 h-5" /> {link.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="pt-16 min-h-screen bg-gray-100 dark:bg-gray-950">
      <div className="flex">
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
        )}

        <aside className={cn(
          'fixed top-16 left-0 z-50 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 transition-transform duration-300 lg:hidden flex flex-col',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <div className="flex items-center justify-between mb-4 px-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">AD</div>
              <div>
                <p className="font-semibold text-sm">Administrateur</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <X className="w-4 h-4" />
            </button>
          </div>
          {nav(() => setMobileMenuOpen(false))}
          <button onClick={() => signOut()} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all w-full mt-2">
            <LogOut className="w-5 h-5" /> Déconnexion
          </button>
        </aside>

        <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">AD</div>
            <div>
              <p className="font-semibold text-sm">Administrateur</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
          </div>
          {nav()}
          <button onClick={() => signOut()} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all">
            <LogOut className="w-5 h-5" /> Déconnexion
          </button>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden mb-4 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <Menu className="w-5 h-5" />
          </button>
          {children}
        </main>
      </div>
    </div>
  );
}
