'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu, X, Search, ShoppingCart, User, ChevronDown,
  GraduationCap, BookOpen,
  LogOut, Heart, ArrowUpRight,
  Wheat, LeafyGreen, TreePalm, Tractor, ClipboardList,
  Gift, Video, Sprout, FlaskConical, Wrench, Droplets,
  ShoppingBag, Flame, Sparkles,
  Building2, Briefcase, Mail
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useScroll } from '@/lib/hooks/use-scroll';
import { useUIStore } from '@/lib/store/ui-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { useCartStore } from '@/lib/store/cart-store';
import { signOut } from '@/lib/auth/actions';
import { NotificationBell } from '@/components/layout/notification-bell';
import { BgImage } from '@/components/ui/bg-image';

interface MegaMenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const formationsItems: MegaMenuItem[] = [
  { label: 'Culture annuelle', href: '/courses?category=culture-annuelle', icon: <Wheat className="w-4 h-4" /> },
  { label: 'Culture maraîchère', href: '/courses?category=culture-maraichere', icon: <LeafyGreen className="w-4 h-4" /> },
  { label: 'Culture pérenne', href: '/courses?category=culture-perenne', icon: <TreePalm className="w-4 h-4" /> },
  { label: 'Formation élevage', href: '/courses?category=formation-elevage', icon: <Tractor className="w-4 h-4" /> },
  { label: 'Gestion de projet', href: '/courses?category=gestion-projet-agricoles', icon: <ClipboardList className="w-4 h-4" /> },
];

const formationsRessources: MegaMenuItem[] = [
  { label: 'Tous les cours', href: '/courses', icon: <BookOpen className="w-4 h-4" /> },
  { label: 'Cours gratuits', href: '/courses?price=free', icon: <Gift className="w-4 h-4" /> },
  { label: 'Formateurs', href: '/instructors', icon: <GraduationCap className="w-4 h-4" /> },
  { label: 'Webinaires', href: '/events', icon: <Video className="w-4 h-4" /> },
];

const boutiqueItems: MegaMenuItem[] = [
  { label: 'Plantes et graines', href: '/marketplace?category=plantes-et-graines', icon: <Sprout className="w-4 h-4" /> },
  { label: 'Intrants agricoles', href: '/marketplace?category=produits-et-intrants-agricoles', icon: <FlaskConical className="w-4 h-4" /> },
  { label: 'Outils agricoles', href: '/marketplace?category=outils-agricoles', icon: <Wrench className="w-4 h-4" /> },
  { label: 'Irrigation', href: '/marketplace?category=systemes-irrigation', icon: <Droplets className="w-4 h-4" /> },
];

const boutiqueServices: MegaMenuItem[] = [
  { label: 'Tous les produits', href: '/marketplace', icon: <ShoppingBag className="w-4 h-4" /> },
  { label: 'Promotions', href: '/marketplace?promo=true', icon: <Flame className="w-4 h-4" /> },
  { label: 'Nouveautés', href: '/marketplace?sort=newest', icon: <Sparkles className="w-4 h-4" /> },
];

const entrepriseItems: MegaMenuItem[] = [
  { label: 'A propos', href: '/about', icon: <Building2 className="w-4 h-4" /> },
  { label: 'Carrieres', href: '/careers', icon: <Briefcase className="w-4 h-4" /> },
  { label: 'Contact', href: '/contact', icon: <Mail className="w-4 h-4" /> },
];

type NavLink = { href: string; label: string } | {
  label: string;
  href: string;
  columns: { title: string; items: MegaMenuItem[] }[];
  featured?: { title: string; description: string; image: string; href: string };
};

const navLinks: NavLink[] = [
  { href: '/', label: 'Accueil' },
  {
    label: 'Formations',
    href: '/courses',
    columns: [
      { title: 'Catégories', items: formationsItems },
      { title: 'Ressources', items: formationsRessources },
    ],
    featured: {
      title: 'Nouveau: Culture de Tomate',
      description: 'Formation complète de la pépinière à la récolte',
      image: '/images/courses/tomato.jpg',
      href: '/course/culture-de-tomate',
    },
  },
  {
    label: 'Boutique',
    href: '/marketplace',
    columns: [
      { title: 'Produits', items: boutiqueItems },
      { title: 'Services', items: boutiqueServices },
    ],
    featured: {
      title: 'Avocatiers en promotion',
      description: 'Plants d\'avocatier - Variétés Hickson & Both 7',
      image: '/images/products/avocado.jpg',
      href: '/product/avocat-hickson-both7',
    },
  },
  { href: '/paths', label: 'Parcours' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Ressources' },
  {
    label: 'Entreprise',
    href: '/about',
    columns: [{ title: 'Entreprise', items: entrepriseItems }],
  },
];

// Shared underline for nav links: an orange bar that grows from the left on
// hover and stays drawn on the active page.
const navUnderline =
  'after:absolute after:bottom-1.5 after:left-3 after:right-3 after:h-[2px] after:origin-left after:bg-[#ff7a3d] after:transition-transform after:duration-300';

const iconButton =
  'relative flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7a3d]';

export const Navbar = () => {
  const pathname = usePathname();
  const { isAtTop, scrollDirection } = useScroll();
  const { isMobileMenuOpen, toggleMobileMenu, toggleSearch, toggleCart } = useUIStore();
  const isAuthenticated = useAuthStore((s) => !s.isLoading && s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const cartCount = useCartStore((s) => s.items.length);
  const lastAddedAt = useCartStore((s) => s.lastAddedAt);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const isScrolledDown = !isAtTop && scrollDirection === 'down';
  const isVisible = scrollDirection === 'up' || isAtTop;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-black/90 font-[var(--font-poppins)] backdrop-blur-md transition-all duration-500',
          isScrolledDown && !isVisible && '-translate-y-full',
          isVisible && 'translate-y-0'
        )}
      >
        <div className="mx-auto max-w-[1520px] px-5 sm:px-10 lg:px-14">
          <div className="flex h-[60px] items-center justify-between gap-6">
            <Link href="/" className="group flex shrink-0 items-center gap-2.5">
              <div className="relative h-14 w-20 shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="CIPRESA Consulting"
                  fill
                  sizes="80px"
                  className="object-cover object-top"
                  priority
                />
              </div>
            </Link>

            <nav className="hidden items-center md:flex">
              {navLinks.map((link) => {
                if ('columns' in link) {
                  const open = activeMegaMenu === link.label;
                  return (
                    <div
                      key={link.label}
                      className="relative"
                      onMouseEnter={() => setActiveMegaMenu(link.label)}
                      onMouseLeave={() => setActiveMegaMenu(null)}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          'relative flex items-center gap-1 px-3 py-2.5 text-[13px] font-medium transition-colors',
                          navUnderline,
                          isActive(link.href) || open
                            ? 'text-white after:scale-x-100'
                            : 'text-white/70 after:scale-x-0 hover:text-white hover:after:scale-x-100'
                        )}
                      >
                        {link.label}
                        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-300', open && 'rotate-180')} />
                      </Link>
                      {open && (
                        // pt-3 keeps the hover bridge between the link and the panel
                        <div className="absolute left-0 top-full z-50 pt-3">
                          <div
                            className={cn(
                              'animate-scale-in overflow-hidden bg-white shadow-[0_24px_60px_rgba(0,0,0,0.18)] ring-1 ring-gray-200',
                              link.featured ? 'w-[620px]' : 'w-60'
                            )}
                          >
                            <div className="flex gap-4 p-4">
                              {link.columns.map((col) => (
                                <div key={col.title} className="flex-1">
                                  <h3 className="mb-2 border-t border-black px-2 pt-3 text-[12px] font-semibold text-black">{col.title}</h3>
                                  <ul>
                                    {col.items.map((item) => (
                                      <li key={item.label}>
                                        <Link
                                          href={item.href}
                                          className="group/item flex items-center gap-3 px-2 py-2 text-[13px] font-medium text-black/70 transition-colors hover:bg-[#f6f5f2] hover:text-black"
                                        >
                                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ff7a3d]/10 text-[#ff7a3d] transition-colors group-hover/item:bg-[#ff7a3d] group-hover/item:text-white">
                                            {item.icon}
                                          </span>
                                          <span>{item.label}</span>
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                              {link.featured && (
                                <Link href={link.featured.href} className="group/feat relative block w-48 shrink-0 overflow-hidden bg-black">
                                  <BgImage src={link.featured.image} className="absolute inset-0 transition-transform duration-700 group-hover/feat:scale-105" sizes="200px" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                                  <div className="relative flex h-full min-h-[190px] flex-col p-4">
                                    <span className="w-fit bg-white px-2.5 py-1 text-[11px] font-semibold leading-none text-black">À la une</span>
                                    <div className="mt-auto">
                                      <h4 className="text-[14px] font-semibold leading-tight text-white">{link.featured.title}</h4>
                                      <p className="mt-1 text-[12px] leading-snug text-white/70">{link.featured.description}</p>
                                    </div>
                                  </div>
                                  <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[#ff7a3d] transition-transform duration-500 group-hover/feat:scale-x-100" />
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative px-3 py-2.5 text-[13px] font-medium transition-colors',
                      navUnderline,
                      isActive(link.href)
                        ? 'text-white after:scale-x-100'
                        : 'text-white/70 after:scale-x-0 hover:text-white hover:after:scale-x-100'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-1">
              <button onClick={toggleSearch} title="Rechercher" aria-label="Rechercher" className={iconButton}>
                <Search className="h-[18px] w-[18px]" />
              </button>

              <button onClick={toggleCart} title="Panier" aria-label="Panier" className={iconButton}>
                <ShoppingCart className="h-[18px] w-[18px]" />
                {cartCount > 0 && (
                  <span
                    key={`${cartCount}-${lastAddedAt}`}
                    className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] animate-scale-in items-center justify-center rounded-full bg-[#ff7a3d] px-1 text-[10px] font-bold text-white ring-2 ring-black"
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <div className="hidden items-center gap-1 sm:flex">
                  <NotificationBell />
                  <Link href="/dashboard" className="flex items-center gap-2 rounded-full py-1 pl-1 pr-1 transition-colors hover:bg-white/10 xl:pr-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff7a3d] text-xs font-bold text-white">
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden text-[13px] font-medium text-white/85 xl:block">{user?.fullName?.split(' ')[0]}</span>
                  </Link>
                </div>
              ) : (
                <>
                <Link href="/auth/login" title="Se connecter" aria-label="Se connecter" className={cn(iconButton, 'sm:hidden')}>
                  <User className="h-[18px] w-[18px]" />
                </Link>
                <div className="ml-2 hidden items-center gap-2 sm:flex">
                  <Link
                    href="/auth/login"
                    className="inline-flex h-9 items-center border border-white/30 px-4 text-[12px] font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-black"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/auth/register"
                    className="group inline-flex h-9 items-center gap-1.5 bg-[#ff7a3d] px-4 text-[12px] font-semibold text-white transition-colors hover:bg-white hover:text-black"
                  >
                    Commencer
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-45" />
                  </Link>
                </div>
                </>
              )}

              <button
                onClick={toggleMobileMenu}
                className={cn(iconButton, 'md:hidden')}
                title="Menu"
                aria-label="Menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 pt-[60px] md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={toggleMobileMenu} />
          {/* dvh, not vh: on phones 100vh includes the area behind the browser
              toolbar, which cut off the bottom of the menu. */}
          <div className="relative max-h-[calc(100dvh-60px)] overflow-y-auto border-t border-white/10 bg-black font-[var(--font-poppins)]">
            <div className="space-y-1 px-5 py-5">
              {!isAuthenticated && (
                <div className="grid grid-cols-2 gap-2 pb-3">
                  <Link
                    href="/auth/login"
                    onClick={toggleMobileMenu}
                    className="inline-flex h-11 items-center justify-center border border-white/30 text-[13px] font-semibold text-white transition-colors hover:bg-white hover:text-black"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={toggleMobileMenu}
                    className="inline-flex h-11 items-center justify-center bg-[#ff7a3d] text-[13px] font-semibold text-white transition-colors hover:bg-white hover:text-black"
                  >
                    S&apos;inscrire
                  </Link>
                </div>
              )}
              {navLinks.map((link) => {
                if ('columns' in link) {
                  return (
                    <div key={link.label} className="pb-2 pt-3">
                      <p className="mb-1 border-t border-white/40 px-3 pt-3 text-[12px] font-semibold text-white">{link.label}</p>
                      {link.columns.flatMap((col) => col.items).map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={toggleMobileMenu}
                          className="flex items-center gap-3 px-3 py-2.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <span className="text-[#ff7a3d]">{item.icon}</span>
                          <span className="text-[14px] font-medium">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={toggleMobileMenu}
                    className={cn(
                      'block border-l-2 px-3 py-2.5 text-[14px] font-medium transition-colors',
                      isActive(link.href)
                        ? 'border-[#ff7a3d] bg-white/5 text-white'
                        : 'border-transparent text-white/70 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {isAuthenticated && (
                <>
                <hr className="!my-4 border-white/10" />
                <div className="space-y-1">
                  <Link href="/dashboard" onClick={toggleMobileMenu} className="flex items-center gap-3 px-3 py-2.5 text-white/70 hover:bg-white/10 hover:text-white">
                    <User className="h-[18px] w-[18px]" /> <span className="text-[14px] font-medium">Mon tableau de bord</span>
                  </Link>
                  <Link href="/dashboard/wishlist" onClick={toggleMobileMenu} className="flex items-center gap-3 px-3 py-2.5 text-white/70 hover:bg-white/10 hover:text-white">
                    <Heart className="h-[18px] w-[18px]" /> <span className="text-[14px] font-medium">Ma liste de souhaits</span>
                  </Link>
                  <button onClick={() => signOut()} className="flex w-full items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-red-950/40">
                    <LogOut className="h-[18px] w-[18px]" /> <span className="text-[14px] font-medium">Déconnexion</span>
                  </button>
                </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
