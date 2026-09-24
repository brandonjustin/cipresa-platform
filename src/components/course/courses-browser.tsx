'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Clock, Star, Play, Grid3X3, List, ArrowRight, X, BookOpen, GraduationCap, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageTransition } from '@/components/animations/motion-components';
import { useCartStore } from '@/lib/store/cart-store';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { Course, CourseCategory } from '@/types';
import { BgImage } from '@/components/ui/bg-image';

const levels = [
  { value: 'all', label: 'Tous niveaux' },
  { value: 'beginner', label: 'Débutant' },
  { value: 'intermediate', label: 'Intermédiaire' },
  { value: 'advanced', label: 'Avancé' },
];

const levelLabels: Record<string, string> = { beginner: 'Débutant', intermediate: 'Intermédiaire', advanced: 'Avancé', all: 'Tous niveaux' };

const sortOptions = [
  { value: 'popular', label: 'Plus populaires' },
  { value: 'newest', label: 'Plus récents' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'rating', label: 'Mieux notés' },
];

interface CoursesBrowserProps {
  courses: Course[];
  categories: CourseCategory[];
}

const heroItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const heroTile = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 20 } },
};

// Reads the ?category= deep link client-side (via useSearchParams) instead
// of the page passing it in as a server-read searchParams prop — that read
// alone would force the whole route to render dynamically on every request,
// when the courses/categories data underneath it is otherwise fully static.
export function CoursesBrowser({ courses, categories }: CoursesBrowserProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const addItem = useCartStore((s) => s.addItem);
  const freeCount = useMemo(() => courses.filter((c) => c.price === 0).length, [courses]);

  const selectCategory = (slug: string | null) => {
    setSelectedCategory(slug);
    router.replace(slug ? `/courses?category=${slug}` : '/courses', { scroll: false });
  };

  const filtered = useMemo(() => {
    const result = courses.filter((c) => {
      const q = searchQuery.trim().toLowerCase();
      if (q && !c.title.toLowerCase().includes(q) && !c.tags.some((t) => t.toLowerCase().includes(q))) return false;
      if (selectedCategory && c.category.slug !== selectedCategory) return false;
      if (selectedLevel !== 'all' && c.level !== selectedLevel) return false;
      return true;
    });

    switch (sortBy) {
      case 'newest': return [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'price-asc': return [...result].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...result].sort((a, b) => b.price - a.price);
      case 'rating': return [...result].sort((a, b) => b.rating - a.rating);
      default: return [...result].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    }
  }, [courses, searchQuery, selectedCategory, selectedLevel, sortBy]);

  const filtersActive = Boolean(searchQuery.trim() || selectedCategory || selectedLevel !== 'all');

  const resetFilters = () => {
    setSearchQuery('');
    selectCategory(null);
    setSelectedLevel('all');
  };

  const handleAddToCart = (course: Course) => {
    addItem({
      id: `course-${course.id}`,
      type: 'course',
      itemId: course.id,
      name: course.title,
      price: course.salePrice ?? course.price,
      quantity: 1,
      image: course.thumbnail,
    });
    toast.success('Ajoute au panier !');
  };

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
                  <GraduationCap className="h-3.5 w-3.5 text-[#ff7a3d]" />
                  Formations
                </motion.span>
                <motion.h1
                  variants={heroItem}
                  className="mt-6 font-display text-[36px] font-medium leading-[0.95] text-black sm:text-[50px] lg:text-[64px]"
                >
                  Catalogue
                  <span className="block">de formations</span>
                </motion.h1>
              </div>

              <motion.div variants={heroItem} className="w-full max-w-[440px]">
                <p className="text-[15px] font-medium leading-[1.55] text-black">
                  Des formations agricoles pour développer vos compétences
                </p>
                <div className="relative mt-7">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/50" />
                  <input
                    type="search"
                    placeholder="Rechercher une formation..."
                    aria-label="Rechercher une formation"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-[46px] w-full bg-white pl-11 pr-11 text-[13px] font-medium text-black ring-1 ring-black/15 transition-shadow placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[#ff7a3d] [&::-webkit-search-cancel-button]:hidden"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Effacer la recherche"
                      className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-black/50 transition-colors hover:bg-black hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <p className="mt-2 h-4 text-[12px] font-medium text-black/50" aria-live="polite">
                  {searchQuery.trim() ? `${filtered.length} formation${filtered.length > 1 ? 's' : ''} trouvee${filtered.length > 1 ? 's' : ''}` : ''}
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
                <p className="relative text-[42px] font-black leading-none">{courses.length}</p>
                <p className="relative mt-1 text-[14px] font-medium leading-tight">
                  Formation{courses.length > 1 ? 's' : ''} au catalogue
                </p>
              </motion.div>

              <motion.div variants={heroTile} className="border-t border-gray-200 px-7 py-7 md:border-l md:border-t-0 lg:px-8">
                <p className="text-[34px] font-black leading-none text-black">{freeCount}</p>
                <div className="my-5 h-px bg-gray-200" />
                <p className="text-[12px] font-medium leading-tight text-black">
                  Formation{freeCount > 1 ? 's' : ''} gratuite{freeCount > 1 ? 's' : ''} pour commencer
                </p>
              </motion.div>

              <motion.div variants={heroTile} className="border-t border-gray-200 px-7 py-7 md:border-l md:border-t-0 lg:px-8">
                <p className="text-[18px] font-semibold leading-tight text-black">Explorer par catégorie</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {categories.slice(0, 6).map((cat) => {
                    const active = selectedCategory === cat.slug;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => selectCategory(active ? null : cat.slug)}
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
            {/* Header + sort */}
            <div className="border-t border-black pt-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <h2 className="font-display text-[28px] font-medium leading-[0.95] text-black sm:text-[38px] lg:text-[46px]">
                  Nos
                  <span className="block">formations</span>
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="mr-2 hidden h-9 bg-[#f6f5f2] p-1 sm:flex" role="radiogroup" aria-label="Affichage">
                    {(['grid', 'list'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        role="radio"
                        aria-checked={viewMode === mode}
                        onClick={() => setViewMode(mode)}
                        aria-label={mode === 'grid' ? 'Vue grille' : 'Vue liste'}
                        className={cn(
                          'flex w-8 items-center justify-center transition-colors duration-300',
                          viewMode === mode ? 'bg-black text-white' : 'text-black/60 hover:text-black'
                        )}
                      >
                        {mode === 'grid' ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
                      </button>
                    ))}
                  </div>
                  <span className="mr-1 text-[12px] font-semibold text-black/50">Trier :</span>
                  {sortOptions.map((opt) => (
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

              {/* Filters */}
              <div className="mt-8 space-y-4 border-y border-gray-200 py-4">
                <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 scrollbar-hide" role="group" aria-label="Filtrer par catégorie">
                  <button
                    type="button"
                    onClick={() => selectCategory(null)}
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
                        onClick={() => selectCategory(active ? null : cat.slug)}
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

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[12px] font-semibold text-black/50">Niveau :</span>
                    <div className="flex h-9 bg-[#f6f5f2] p-1" role="radiogroup" aria-label="Niveau">
                      {levels.map((lvl) => {
                        const active = selectedLevel === lvl.value;
                        return (
                          <button
                            key={lvl.value}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => setSelectedLevel(lvl.value)}
                            className={cn(
                              'px-3 text-[12px] font-semibold whitespace-nowrap transition-colors duration-300',
                              active ? 'bg-black text-white' : 'text-black/70 hover:text-black'
                            )}
                          >
                            {lvl.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <p className="text-[13px] font-medium text-black/60" aria-live="polite">
                      <span className="font-black text-black">{filtered.length}</span>
                      {filtered.length !== courses.length && <> sur {courses.length}</>} formation{courses.length > 1 ? 's' : ''}
                    </p>
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
            </div>

            {/* Grid / list */}
            {filtered.length > 0 && (
              <motion.div
                key={`${selectedCategory ?? 'all'}-${selectedLevel}-${sortBy}-${viewMode}-${searchQuery.trim()}`}
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
                className={cn('mt-10', viewMode === 'grid' ? 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid gap-4')}
              >
                {filtered.map((course) => {
                  const isFree = course.price === 0;
                  const courseHref = `/course/${course.slug}`;
                  const price = course.salePrice ?? course.price;
                  const isList = viewMode === 'list';
                  return (
                    <motion.article
                      key={course.id}
                      variants={heroTile}
                      className={cn(
                        'group relative flex h-full bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200 transition-shadow duration-500 hover:shadow-[0_24px_60px_rgba(0,0,0,0.1)]',
                        isList ? 'flex-col sm:flex-row' : 'flex-col'
                      )}
                    >
                      <Link
                        href={courseHref}
                        aria-label={course.title}
                        className={cn('relative block overflow-hidden bg-[#f6f5f2]', isList ? 'h-48 sm:h-auto sm:w-64 sm:shrink-0' : 'h-48')}
                      >
                        {course.thumbnail && (
                          <BgImage src={course.thumbnail} className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                        <div className="absolute left-4 top-4 flex flex-col items-start gap-1.5">
                          {isFree && <span className="bg-[#ff7a3d] px-2.5 py-1 text-[11px] font-semibold leading-none text-white">Gratuit</span>}
                          {course.level !== 'all' && (
                            <span className="bg-white px-2.5 py-1 text-[11px] font-semibold leading-none text-black">{levelLabels[course.level]}</span>
                          )}
                        </div>
                        <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                          <span className="flex h-12 w-12 scale-75 items-center justify-center rounded-full bg-white text-[#ff7a3d] transition-transform duration-500 group-hover:scale-100">
                            <Play className="ml-0.5 h-5 w-5 fill-current" />
                          </span>
                        </span>
                        <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[#ff7a3d] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                      </Link>

                      <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
                        <p className="text-[11px] font-semibold text-[#ff7a3d]">{course.category.name}</p>
                        <Link href={courseHref}>
                          <h3 className="mt-1.5 line-clamp-2 min-h-[40px] text-[16px] font-semibold leading-tight text-black transition-colors duration-300 hover:text-[#ff7a3d]">
                            {course.title}
                          </h3>
                        </Link>
                        <p className="mt-2 flex items-center gap-2 text-[12px] font-medium text-black/60">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white">
                            {course.instructor.fullName.charAt(0)}
                          </span>
                          {course.instructor.fullName}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] font-medium text-black">
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-[#ff7a3d] text-[#ff7a3d]" />
                            {course.rating > 0 ? course.rating.toFixed(1) : '—'}
                            <span className="text-black/50">({course.totalReviews})</span>
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 stroke-[1.7]" />
                            {course.duration}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <BookOpen className="h-3.5 w-3.5 stroke-[1.7]" />
                            {course.totalLessons} leçons
                          </span>
                        </div>

                        <div className="my-4 h-px bg-gray-200" />

                        <div className="mt-auto flex items-center justify-between gap-3">
                          <p className="flex flex-wrap items-baseline gap-x-1.5 leading-none">
                            <span className="text-[20px] font-black text-black">{isFree ? 'Gratuit' : formatCurrency(price, course.currency)}</span>
                            {!isFree && course.salePrice != null && course.salePrice < course.price && (
                              <span className="text-[12px] font-medium text-black/40 line-through">{formatCurrency(course.price, course.currency)}</span>
                            )}
                          </p>
                          {isFree ? (
                            <Link
                              href={courseHref}
                              className="inline-flex h-[40px] shrink-0 items-center justify-center gap-2 bg-black px-4 text-[12px] font-semibold text-white transition-colors duration-300 hover:bg-[#ff7a3d]"
                            >
                              Commencer
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAddToCart(course)}
                              aria-label={`Ajouter ${course.title} au panier`}
                              className="inline-flex h-[40px] shrink-0 items-center justify-center gap-2 bg-black px-4 text-[12px] font-semibold text-white transition-colors duration-300 hover:bg-[#ff7a3d] active:scale-[0.97]"
                            >
                              <ShoppingCart className="h-4 w-4" />
                              Ajouter
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </motion.div>
            )}

            {filtered.length === 0 && (
              <div className="mt-10 flex flex-col items-center bg-[#f6f5f2] px-6 py-20 text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ff7a3d]/10 text-[#ff7a3d]">
                  <Search className="h-8 w-8 stroke-[1.6]" />
                </span>
                <h3 className="mt-6 font-display text-[24px] font-medium leading-tight text-black">Aucun cours trouvé</h3>
                <p className="mt-2 text-[13px] font-medium text-black/60">Essayez de modifier vos filtres de recherche</p>
                <button
                  type="button"
                  onClick={resetFilters}
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
