'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, ShoppingCart, Star, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageTransition } from '@/components/animations/motion-components';
import { useCartStore } from '@/lib/store/cart-store';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { Product, ProductCategory } from '@/types';
import { BgImage } from '@/components/ui/bg-image';

const SORT_OPTIONS = [
  { value: 'popular', label: 'Plus populaires' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'rating', label: 'Mieux notés' },
];

const ITEMS_PER_PAGE = 8;

interface MarketplaceBrowserProps {
  products: Product[];
  categories: ProductCategory[];
}

const heroItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const heroTile = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 20 } },
};

export function MarketplaceBrowser({ products, categories }: MarketplaceBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('popular');
  const [showInStock, setShowInStock] = useState(false);
  const [page, setPage] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  // Links such as the header menu, a product breadcrumb or the global search arrive as
  // /marketplace?category=<slug> or /marketplace?q=<terms>.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('category');
    if (slug && categories.some((c) => c.slug === slug)) setSelectedCategory(slug);
    const q = params.get('q');
    if (q) setSearchQuery(q);
  }, [categories]);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: `product-${product.id}-base`,
      type: 'product',
      itemId: product.id,
      name: product.name,
      price: product.salePrice ?? product.price,
      quantity: 1,
      image: product.images[0] ?? '',
    });
    toast.success('Ajoute au panier !');
  };

  // Search + category only: the base the availability options count from.
  const baseFiltered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.tags.some((t) => t.toLowerCase().includes(q))) return false;
      if (selectedCategory && p.category.slug !== selectedCategory) return false;
      return true;
    });
  }, [products, searchQuery, selectedCategory]);

  const availableCount = useMemo(() => baseFiltered.filter((p) => p.stock > 0).length, [baseFiltered]);
  const filtersActive = Boolean(searchQuery.trim() || selectedCategory || showInStock);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setShowInStock(false);
    setPage(1);
  };

  const filtered = useMemo(() => {
    const result = showInStock ? baseFiltered.filter((p) => p.stock > 0) : baseFiltered;

    switch (sortBy) {
      case 'price-asc': return [...result].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...result].sort((a, b) => b.price - a.price);
      case 'rating': return [...result].sort((a, b) => b.rating - a.rating);
      default: return [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [baseFiltered, sortBy, showInStock]);

  const inStockCount = useMemo(() => products.filter((p) => p.stock > 0).length, [products]);

  const paginated = filtered.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = paginated.length < filtered.length;

  return (
    <PageTransition>
      <div className="pt-[60px]">
        <section className="relative overflow-hidden bg-[#f6f5f2]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
            className="relative mx-auto max-w-[1520px] px-6 pb-16 pt-10 sm:px-10 lg:px-14 lg:pb-20 lg:pt-14"
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <div>
                <motion.span
                  variants={heroItem}
                  className="inline-flex items-center gap-2 bg-white px-3 py-1.5 text-[12px] font-semibold leading-none text-black ring-1 ring-black/10"
                >
                  <ShoppingBag className="h-3.5 w-3.5 text-[#ff7a3d]" />
                  Boutique
                </motion.span>
                <motion.h1
                  variants={heroItem}
                  className="mt-6 font-display text-[36px] font-medium leading-[0.95] text-black sm:text-[50px] lg:text-[64px]"
                >
                  Boutique
                  <span className="block">agricole</span>
                </motion.h1>
              </div>

              <motion.div variants={heroItem} className="w-full max-w-[440px]">
                <p className="text-[15px] font-medium leading-[1.55] text-black">
                  Semences, plants, intrants et équipements pour une agriculture productive
                </p>
                <div className="relative mt-7">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/50" />
                  <input
                    type="search"
                    placeholder="Rechercher un produit..."
                    aria-label="Rechercher un produit"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    className="h-[46px] w-full bg-white pl-11 pr-11 text-[13px] font-medium text-black ring-1 ring-black/15 transition-shadow placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[#ff7a3d] [&::-webkit-search-cancel-button]:hidden"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setPage(1);
                      }}
                      aria-label="Effacer la recherche"
                      className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-black/50 transition-colors hover:bg-black hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <p className="mt-2 h-4 text-[12px] font-medium text-black/50" aria-live="polite">
                  {searchQuery.trim() ? `${filtered.length} produit${filtered.length > 1 ? 's' : ''} trouve${filtered.length > 1 ? 's' : ''}` : ''}
                </p>
              </motion.div>
            </div>

            <motion.div
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
              className="mt-12 grid overflow-hidden bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:grid-cols-[0.9fr_0.8fr_1.3fr]"
            >
              <motion.div variants={heroTile} className="relative min-h-[150px] overflow-hidden bg-[#ff7a3d] px-8 py-7 text-white">
                <div
                  aria-hidden="true"
                  className="absolute -bottom-24 right-6 h-[210px] w-[210px] rounded-full border border-white/35 opacity-70"
                  style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
                />
                <p className="relative text-[42px] font-black leading-none">{products.length}</p>
                <p className="relative mt-1 text-[14px] font-medium leading-tight">
                  Produit{products.length > 1 ? 's' : ''} au catalogue
                </p>
              </motion.div>

              <motion.button
                variants={heroTile}
                type="button"
                onClick={() => {
                  setShowInStock((v) => !v);
                  setPage(1);
                }}
                aria-pressed={showInStock}
                className={cn(
                  'group border-t border-gray-200 px-7 py-7 text-left transition-colors duration-500 md:border-l md:border-t-0 lg:px-8',
                  showInStock ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
                )}
              >
                <p className="text-[34px] font-black leading-none">{inStockCount}</p>
                <div className={cn('my-5 h-px transition-colors duration-500', showInStock ? 'bg-white/30' : 'bg-gray-200 group-hover:bg-white/30')} />
                <p className="text-[12px] font-medium leading-tight">
                  {showInStock ? 'Filtre actif : produits en stock uniquement' : 'Produits disponibles en stock — cliquez pour filtrer'}
                </p>
              </motion.button>

              <motion.div variants={heroTile} className="border-t border-gray-200 px-7 py-7 md:border-l md:border-t-0 lg:px-8">
                <p className="text-[18px] font-semibold leading-tight text-black">Explorer par catégorie</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {categories.slice(0, 6).map((cat) => {
                    const active = selectedCategory === cat.slug;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(active ? null : cat.slug);
                          setPage(1);
                        }}
                        aria-pressed={active}
                        className={cn(
                          'px-3 py-1.5 text-[12px] font-semibold leading-none transition-colors duration-300',
                          active ? 'bg-[#ff7a3d] text-white' : 'bg-[#f6f5f2] text-black hover:bg-black hover:text-white'
                        )}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-[1520px] px-6 py-16 sm:px-10 lg:px-14 lg:py-20">
            {/* Header + toolbar */}
            <div className="border-t border-black pt-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <h2 className="font-display text-[28px] font-medium leading-[0.95] text-black sm:text-[38px] lg:text-[46px]">
                  Nos
                  <span className="block">produits</span>
                </h2>
                <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Trier les produits">
                  <span className="mr-1 text-[12px] font-semibold text-black/50">Trier :</span>
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSortBy(opt.value)}
                      aria-pressed={sortBy === opt.value}
                      className={cn(
                        'h-9 px-3.5 text-[12px] font-semibold whitespace-nowrap transition-colors duration-300',
                        sortBy === opt.value ? 'bg-black text-white' : 'bg-[#f6f5f2] text-black hover:bg-black/10'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 border-y border-gray-200 py-4 md:flex-row md:items-center md:justify-between">
                <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 scrollbar-hide" role="group" aria-label="Filtrer par catégorie">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(null);
                      setPage(1);
                    }}
                    aria-pressed={!selectedCategory}
                    className={cn(
                      'h-9 shrink-0 px-4 text-[12px] font-semibold transition-colors duration-300',
                      !selectedCategory ? 'bg-[#ff7a3d] text-white' : 'bg-[#f6f5f2] text-black hover:bg-black hover:text-white'
                    )}
                  >
                    Tous
                  </button>
                  {categories.map((cat) => {
                    const active = selectedCategory === cat.slug;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(active ? null : cat.slug);
                          setPage(1);
                        }}
                        aria-pressed={active}
                        className={cn(
                          'flex h-9 shrink-0 items-center gap-1.5 px-4 text-[12px] font-semibold whitespace-nowrap transition-colors duration-300',
                          active ? 'bg-[#ff7a3d] text-white' : 'bg-[#f6f5f2] text-black hover:bg-black hover:text-white'
                        )}
                      >
                        <span aria-hidden="true">{cat.icon}</span>
                        {cat.name}
                      </button>
                    );
                  })}
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-3">
                  <p className="text-[13px] font-medium text-black/60" aria-live="polite">
                    <span className="font-black text-black">{filtered.length}</span>
                    {filtered.length !== products.length && <> sur {products.length}</>} produit{products.length > 1 ? 's' : ''}
                  </p>

                  {/* Availability: two explicit options instead of an on/off switch */}
                  <div role="radiogroup" aria-label="Disponibilité" className="flex h-9 bg-[#f6f5f2] p-1">
                    {[
                      { value: false, label: 'Tous', count: baseFiltered.length },
                      { value: true, label: 'En stock', count: availableCount },
                    ].map((opt) => {
                      const active = showInStock === opt.value;
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => {
                            setShowInStock(opt.value);
                            setPage(1);
                          }}
                          className={cn(
                            'flex items-center gap-1.5 px-3 text-[12px] font-semibold transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7a3d]',
                            active ? 'bg-black text-white' : 'text-black/70 hover:text-black'
                          )}
                        >
                          {opt.value && (
                            <span className={cn('h-1.5 w-1.5 rounded-full', active ? 'bg-emerald-400' : 'bg-emerald-500')} aria-hidden="true" />
                          )}
                          {opt.label}
                          <span className={cn('text-[11px] font-medium', active ? 'text-white/60' : 'text-black/40')}>{opt.count}</span>
                        </button>
                      );
                    })}
                  </div>

                  {filtersActive && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-[12px] font-semibold text-[#ff7a3d] underline-offset-4 hover:underline"
                    >
                      Réinitialiser
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Grid */}
            {filtered.length > 0 && (
              <motion.div
                key={`${selectedCategory ?? 'all'}-${sortBy}-${showInStock}-${searchQuery.trim()}`}
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
                className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
              >
                {paginated.map((product) => {
                  const inStock = product.stock > 0;
                  const productHref = `/product/${product.slug}`;
                  return (
                    <motion.article
                      key={product.id}
                      variants={heroTile}
                      className="group relative flex h-full flex-col bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200 transition-shadow duration-500 hover:shadow-[0_24px_60px_rgba(0,0,0,0.1)]"
                    >
                      <Link href={productHref} className="relative block aspect-square overflow-hidden bg-[#f6f5f2]" aria-label={product.name}>
                        {product.images[0] && (
                          <BgImage src={product.images[0]} className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                        <div className="absolute left-4 top-4 flex flex-col items-start gap-1.5">
                          {product.featured && (
                            <span className="bg-white px-2.5 py-1 text-[11px] font-semibold leading-none text-black">Meilleure vente</span>
                          )}
                          {product.salePrice && (
                            <span className="bg-[#ff7a3d] px-2.5 py-1 text-[11px] font-semibold leading-none text-white">Promo</span>
                          )}
                        </div>
                        {inStock && product.stock <= 10 && (
                          <span className="absolute bottom-4 left-4 bg-black px-2.5 py-1 text-[11px] font-semibold leading-none text-white">
                            Plus que {product.stock}
                          </span>
                        )}
                        <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[#ff7a3d] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                      </Link>

                      <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
                        <p className="text-[11px] font-semibold text-[#ff7a3d]">{product.category.name}</p>
                        <Link href={productHref}>
                          <h3 className="mt-1.5 line-clamp-2 min-h-[40px] text-[16px] font-semibold leading-tight text-black transition-colors duration-300 hover:text-[#ff7a3d]">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="mt-3 flex items-center gap-1 text-[12px] font-medium text-black">
                          {Array.from({ length: 5 }).map((_, star) => (
                            <Star
                              key={star}
                              className={cn('h-3.5 w-3.5', star < Math.round(product.rating) ? 'fill-[#ff7a3d] text-[#ff7a3d]' : 'fill-black/10 text-black/10')}
                            />
                          ))}
                          <span className="ml-1 text-black/60">({product.totalReviews})</span>
                        </div>

                        <div className="my-4 h-px bg-gray-200" />

                        <div className="mt-auto flex items-end justify-between gap-3">
                          <div className="min-w-0 leading-none">
                            <p className="flex flex-wrap items-baseline gap-x-1.5">
                              <span className="text-[20px] font-black text-black">
                                {formatCurrency(product.salePrice ?? product.price, product.currency)}
                              </span>
                              {product.salePrice && (
                                <span className="text-[12px] font-medium text-black/40 line-through">
                                  {formatCurrency(product.price, product.currency)}
                                </span>
                              )}
                            </p>
                            <p className="mt-1.5 text-[11px] font-medium text-black/50">/ {product.unit}</p>
                            <p className={cn('mt-1.5 text-[11px] font-semibold', inStock ? 'text-emerald-600' : 'text-red-500')}>
                              {inStock ? 'En stock' : 'Rupture'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            disabled={!inStock}
                            aria-label={inStock ? `Ajouter ${product.name} au panier` : `${product.name} en rupture de stock`}
                            className="inline-flex h-[40px] shrink-0 items-center justify-center gap-2 bg-black px-4 text-[12px] font-semibold text-white transition-colors duration-300 hover:bg-[#ff7a3d] active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-black/15 disabled:text-black/40"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            {inStock ? 'Ajouter' : 'Rupture'}
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </motion.div>
            )}

            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  className="inline-flex h-[46px] items-center justify-center gap-2 border border-black/20 px-7 text-[13px] font-semibold text-black transition-colors hover:border-black hover:bg-black hover:text-white"
                >
                  Voir plus de produits ({filtered.length - paginated.length} restants)
                </button>
              </div>
            )}

            {filtered.length === 0 && (
              <div className="mt-10 flex flex-col items-center bg-[#f6f5f2] px-6 py-20 text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ff7a3d]/10 text-[#ff7a3d]">
                  <Search className="h-8 w-8 stroke-[1.6]" />
                </span>
                <h3 className="mt-6 font-display text-[24px] font-medium leading-tight text-black">Aucun produit trouvé</h3>
                <p className="mt-2 text-[13px] font-medium text-black/60">Essayez de modifier vos filtres</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                    setShowInStock(false);
                    setPage(1);
                  }}
                  className="mt-7 inline-flex h-[42px] items-center bg-black px-6 text-[13px] font-semibold text-white transition-colors hover:bg-[#ff7a3d]"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
