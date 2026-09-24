'use client';

import { Fragment, useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowUpRight, TrendingUp, Clock, Leaf, Loader2, CornerDownLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/lib/store/ui-store';
import { cn } from '@/lib/utils/cn';
import { searchCatalog, getTrendingCourses, type SearchResultItem, type SearchResults } from '@/lib/actions/search';
import { BgImage } from '@/components/ui/bg-image';

const SUGGESTIONS = ['Culture de tomate', 'Avocatier', 'Élevage poulets', 'Engrais'];
const RECENT_KEY = 'cipresa:recent-searches';
const MAX_RECENT = 6;
const EMPTY_RESULTS: SearchResults = { courses: [], products: [], plants: [] };

function readRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string').slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

function writeRecent(list: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    // Storage unavailable (private mode, blocked): recent searches just aren't kept.
  }
}

function HighlightText({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'i'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === q.toLowerCase() ? (
          <mark key={i} className="bg-[#ff7a3d]/15 px-0.5 text-[#c2521f]">
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}

type Row = { key: string; href: string; item: SearchResultItem; kind: 'course' | 'product' | 'plant' };

export const SearchModal = () => {
  const router = useRouter();
  const { isSearchOpen, toggleSearch } = useUIStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>(EMPTY_RESULTS);
  const [isLoading, setIsLoading] = useState(false);
  const [trending, setTrending] = useState<SearchResultItem[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestId = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim();
  const isSearching = trimmed.length >= 2;

  useEffect(() => {
    if (isSearchOpen) {
      setRecent(readRecent());
      setTimeout(() => inputRef.current?.focus(), 100);
      getTrendingCourses().then(setTrending).catch(() => {});
    } else {
      setQuery('');
      setResults(EMPTY_RESULTS);
      setIsLoading(false);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) toggleSearch();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, toggleSearch]);

  // Debounced search; only the latest request is allowed to update the results.
  useEffect(() => {
    setActiveIndex(0);
    if (!isSearching) {
      setResults(EMPTY_RESULTS);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const id = ++requestId.current;
    const timeout = setTimeout(() => {
      searchCatalog(trimmed)
        .then((r) => {
          if (id === requestId.current) setResults(r);
        })
        .catch(() => {
          if (id === requestId.current) setResults(EMPTY_RESULTS);
        })
        .finally(() => {
          if (id === requestId.current) setIsLoading(false);
        });
    }, 250);
    return () => clearTimeout(timeout);
  }, [trimmed, isSearching]);

  const rows: Row[] = useMemo(
    () => [
      ...results.courses.map((item) => ({ key: `c-${item.id}`, href: `/course/${item.slug}`, item, kind: 'course' as const })),
      ...results.products.map((item) => ({ key: `p-${item.id}`, href: `/product/${item.slug}`, item, kind: 'product' as const })),
      ...results.plants.map((item) => ({ key: `l-${item.id}`, href: `/plant/${item.slug}`, item, kind: 'plant' as const })),
    ],
    [results]
  );

  const rememberSearch = (term: string) => {
    const t = term.trim();
    if (t.length < 2) return;
    const next = [t, ...readRecent().filter((r) => r.toLowerCase() !== t.toLowerCase())].slice(0, MAX_RECENT);
    writeRecent(next);
    setRecent(next);
  };

  const clearRecent = () => {
    writeRecent([]);
    setRecent([]);
  };

  const openRow = (row: Row) => {
    rememberSearch(trimmed);
    toggleSearch();
    router.push(row.href);
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!rows.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % rows.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + rows.length) % rows.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const row = rows[activeIndex];
      if (row) openRow(row);
    }
  };

  // Keep the keyboard-selected row in view.
  useEffect(() => {
    listRef.current?.querySelector(`[data-row-index="${activeIndex}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const q = encodeURIComponent(trimmed);
  const groups = [
    { kind: 'course' as const, title: 'Cours', items: results.courses, allHref: `/courses?q=${q}`, allLabel: 'Voir tous les cours' },
    { kind: 'product' as const, title: 'Produits', items: results.products, allHref: `/marketplace?q=${q}`, allLabel: 'Voir tous les produits' },
    { kind: 'plant' as const, title: 'Plantes', items: results.plants, allHref: '/encyclopedia', allLabel: 'Voir toutes les plantes' },
  ];

  const chips = recent.length > 0 ? recent : SUGGESTIONS;

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 font-[var(--font-poppins)]" role="dialog" aria-modal="true" aria-label="Recherche">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={toggleSearch}
          />
          <div className="pointer-events-none absolute inset-x-0 top-0">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto mx-auto mt-[76px] max-w-3xl px-4"
            >
              <div className="overflow-hidden bg-white shadow-[0_30px_80px_rgba(0,0,0,0.3)]">
                {/* Input */}
                <div className="relative border-b border-gray-200">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#ff7a3d]">
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                  </span>
                  <label htmlFor="global-search-input" className="sr-only">
                    Rechercher des cours, produits, plantes
                  </label>
                  <input
                    id="global-search-input"
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={onInputKeyDown}
                    placeholder="Rechercher des cours, produits, plantes..."
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={rows.length > 0}
                    aria-controls="global-search-results"
                    aria-activedescendant={rows[activeIndex] ? `search-row-${activeIndex}` : undefined}
                    className="h-[68px] w-full bg-transparent pl-14 pr-28 text-[17px] font-medium text-black placeholder:text-black/35 focus:outline-none"
                  />
                  <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2">
                    {query && (
                      <button
                        type="button"
                        onClick={() => {
                          setQuery('');
                          inputRef.current?.focus();
                        }}
                        aria-label="Effacer la recherche"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-black/50 transition-colors hover:bg-black hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={toggleSearch}
                      className="hidden bg-[#f6f5f2] px-2 py-1 text-[11px] font-semibold text-black/60 transition-colors hover:bg-black hover:text-white sm:inline-flex"
                      aria-label="Fermer la recherche"
                    >
                      Esc
                    </button>
                  </div>
                </div>

                {!isSearching ? (
                  <div className="px-6 pb-6 pt-5">
                    <div className="flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-[12px] font-semibold text-black/50">
                        <Clock className="h-3.5 w-3.5" />
                        {recent.length > 0 ? 'Recherches récentes' : 'Suggestions'}
                      </h3>
                      {recent.length > 0 && (
                        <button type="button" onClick={clearRecent} className="text-[12px] font-semibold text-[#ff7a3d] hover:underline">
                          Effacer
                        </button>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {chips.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setQuery(s);
                            inputRef.current?.focus();
                          }}
                          className="bg-[#f6f5f2] px-3 py-1.5 text-[13px] font-semibold text-black transition-colors duration-300 hover:bg-black hover:text-white"
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    {trending.length > 0 && (
                      <div className="mt-7">
                        <h3 className="flex items-center gap-2 text-[12px] font-semibold text-black/50">
                          <TrendingUp className="h-3.5 w-3.5" /> Tendance
                        </h3>
                        <div className="mt-3 grid gap-px overflow-hidden bg-gray-200 ring-1 ring-gray-200 sm:grid-cols-2">
                          {trending.map((c) => (
                            <Link
                              key={c.id}
                              href={`/course/${c.slug}`}
                              onClick={toggleSearch}
                              className="group flex items-center gap-3 bg-white p-3 transition-colors hover:bg-[#f6f5f2]"
                            >
                              <BgImage src={c.image} className="h-11 w-11 shrink-0 bg-[#f6f5f2]" sizes="160px" />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-[13px] font-semibold text-black">{c.title}</p>
                                <p className="mt-0.5 text-[12px] font-medium text-black/50">{c.meta}</p>
                              </div>
                              <ArrowUpRight className="h-4 w-4 shrink-0 text-black/30 transition-all duration-300 group-hover:rotate-45 group-hover:text-[#ff7a3d]" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : rows.length > 0 ? (
                  <div id="global-search-results" ref={listRef} role="listbox" className="max-h-[60vh] overflow-y-auto">
                    {groups.map((group) => {
                      if (!group.items.length) return null;
                      return (
                        <div key={group.kind} className="border-b border-gray-100 px-3 py-4 last:border-0">
                          <h3 className="px-3 text-[12px] font-semibold text-black/50">
                            {group.title} <span className="text-black/30">({group.items.length})</span>
                          </h3>
                          <div className="mt-2">
                            {group.items.map((item) => {
                              const index = rows.findIndex((r) => r.kind === group.kind && r.item.id === item.id);
                              const row = rows[index];
                              const active = index === activeIndex;
                              return (
                                <Link
                                  key={item.id}
                                  id={`search-row-${index}`}
                                  data-row-index={index}
                                  role="option"
                                  aria-selected={active}
                                  href={row.href}
                                  onClick={() => {
                                    rememberSearch(trimmed);
                                    toggleSearch();
                                  }}
                                  onMouseEnter={() => setActiveIndex(index)}
                                  className={cn(
                                    'relative flex items-center gap-4 px-3 py-2.5 transition-colors',
                                    active ? 'bg-[#f6f5f2]' : 'hover:bg-[#f6f5f2]'
                                  )}
                                >
                                  <span className={cn('absolute inset-y-0 left-0 w-[3px] bg-[#ff7a3d] transition-opacity', active ? 'opacity-100' : 'opacity-0')} />
                                  {group.kind === 'plant' ? (
                                    <span className="flex h-10 w-14 shrink-0 items-center justify-center bg-[#ff7a3d]/10 text-[#ff7a3d]">
                                      <Leaf className="h-5 w-5" />
                                    </span>
                                  ) : (
                                    <BgImage src={item.image} className="h-10 w-14 shrink-0 bg-[#f6f5f2]" sizes="160px" />
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-[14px] font-semibold text-black">
                                      <HighlightText text={item.title} query={trimmed} />
                                    </p>
                                    <p className={cn('mt-0.5 text-[12px] font-medium text-black/50', group.kind === 'plant' && 'italic')}>{item.meta}</p>
                                  </div>
                                  {active ? (
                                    <CornerDownLeft className="h-4 w-4 shrink-0 text-[#ff7a3d]" aria-hidden="true" />
                                  ) : (
                                    <ArrowUpRight className="h-4 w-4 shrink-0 text-black/25" aria-hidden="true" />
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                          <Link
                            href={group.allHref}
                            onClick={() => {
                              rememberSearch(trimmed);
                              toggleSearch();
                            }}
                            className="mx-3 mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#ff7a3d] hover:underline"
                          >
                            {group.allLabel}
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                ) : isLoading ? (
                  <div className="space-y-2 p-5" aria-hidden="true">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="flex animate-pulse items-center gap-4">
                        <div className="h-10 w-14 bg-[#f6f5f2]" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-1/2 bg-[#f6f5f2]" />
                          <div className="h-2.5 w-1/4 bg-[#f6f5f2]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ff7a3d]/10 text-[#ff7a3d]">
                      <Search className="h-6 w-6" />
                    </span>
                    <p className="mt-4 text-[15px] font-semibold text-black">Aucun résultat pour « {trimmed} »</p>
                    <p className="mt-1 text-[13px] font-medium text-black/55">Essayez d&apos;autres termes de recherche</p>
                  </div>
                )}

                {/* Footer hints */}
                <div className="hidden items-center gap-5 border-t border-gray-100 bg-[#fbfaf8] px-6 py-3 text-[11px] font-medium text-black/45 sm:flex">
                  <span className="inline-flex items-center gap-1.5">
                    <kbd className="bg-white px-1.5 py-0.5 font-semibold ring-1 ring-black/10">↑</kbd>
                    <kbd className="bg-white px-1.5 py-0.5 font-semibold ring-1 ring-black/10">↓</kbd>
                    naviguer
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <kbd className="bg-white px-1.5 py-0.5 font-semibold ring-1 ring-black/10">Entrée</kbd>
                    ouvrir
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <kbd className="bg-white px-1.5 py-0.5 font-semibold ring-1 ring-black/10">Ctrl K</kbd>
                    rechercher partout
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
