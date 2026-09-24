'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowUpRight, Search, Newspaper, X } from 'lucide-react';
import { PageTransition } from '@/components/animations/motion-components';
import { formatDate } from '@/lib/utils/format';
import type { BlogPost } from '@/types';
import { BgImage } from '@/components/ui/bg-image';

const heroItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const heroTile = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 20 } },
};

export function BlogBrowser({ posts }: { posts: BlogPost[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Tag links from an article point here as /blog?q=<tag>.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q');
    if (q) setSearchQuery(q);
  }, []);
  const categories = useMemo(() => Array.from(new Set(posts.map((p) => p.category).filter(Boolean))), [posts]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter((p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)));
  }, [posts, searchQuery]);

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
                  <Newspaper className="h-3.5 w-3.5 text-[#ff7a3d]" />
                  Blog
                </motion.span>
                <motion.h1
                  variants={heroItem}
                  className="mt-6 font-display text-[36px] font-medium leading-[0.95] text-black sm:text-[50px] lg:text-[64px]"
                >
                  Blog
                  <span className="block">agricole</span>
                </motion.h1>
              </div>

              <motion.div variants={heroItem} className="w-full max-w-[440px]">
                <p className="text-[15px] font-medium leading-[1.55] text-black">
                  Actualités, conseils et guides pour une agriculture performante
                </p>
                <div className="relative mt-7">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/50" />
                  <input
                    type="search"
                    placeholder="Rechercher un article..."
                    aria-label="Rechercher un article"
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
                  {searchQuery.trim() ? `${filtered.length} article${filtered.length > 1 ? 's' : ''} trouve${filtered.length > 1 ? 's' : ''}` : ''}
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
                <p className="relative text-[42px] font-black leading-none">{posts.length}</p>
                <p className="relative mt-1 text-[14px] font-medium leading-tight">
                  Article{posts.length > 1 ? 's' : ''} publie{posts.length > 1 ? 's' : ''}
                </p>
              </motion.div>

              <motion.div variants={heroTile} className="border-t border-gray-200 px-7 py-7 md:border-l md:border-t-0 lg:px-8">
                <p className="text-[34px] font-black leading-none text-black">{categories.length}</p>
                <div className="my-5 h-px bg-gray-200" />
                <p className="text-[12px] font-medium leading-tight text-black">
                  Thematique{categories.length > 1 ? 's' : ''} abordee{categories.length > 1 ? 's' : ''} dans nos articles
                </p>
              </motion.div>

              <motion.div variants={heroTile} className="border-t border-gray-200 px-7 py-7 md:border-l md:border-t-0 lg:px-8">
                <p className="text-[18px] font-semibold leading-tight text-black">Explorer par thematique</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {categories.slice(0, 6).map((category) => {
                    const active = searchQuery.trim().toLowerCase() === category.toLowerCase();
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setSearchQuery(active ? '' : category)}
                        aria-pressed={active}
                        className={`px-3 py-1.5 text-[12px] font-semibold leading-none transition-colors duration-300 ${
                          active ? 'bg-[#ff7a3d] text-white' : 'bg-[#f6f5f2] text-black hover:bg-black hover:text-white'
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid gap-8 border-t border-black pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16"
            >
              <motion.h2 variants={heroItem} className="font-display text-[28px] font-medium leading-[0.95] text-black sm:text-[38px] lg:text-[46px]">
                {searchQuery.trim() ? 'Resultats' : 'Derniers'}
                <span className="block">{searchQuery.trim() ? 'de votre recherche' : 'articles'}</span>
              </motion.h2>
              <motion.p variants={heroItem} className="max-w-[420px] text-[15px] font-medium leading-[1.55] text-black">
                {searchQuery.trim()
                  ? `${filtered.length} article${filtered.length > 1 ? 's' : ''} pour « ${searchQuery.trim()} ».`
                  : 'Des retours de terrain, des guides pratiques et l actualite des filieres agricoles.'}
              </motion.p>
            </motion.div>

            {filtered.length === 0 ? (
              <div className="mt-14 flex flex-col items-center bg-[#f6f5f2] px-6 py-20 text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ff7a3d]/10 text-[#ff7a3d]">
                  <Search className="h-8 w-8 stroke-[1.6]" />
                </span>
                <h3 className="mt-6 font-display text-[24px] font-medium leading-tight text-black">Aucun article trouvé</h3>
                <p className="mt-2 text-[13px] font-medium text-black/60">Essayez un autre mot-cle ou une autre thematique.</p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-7 inline-flex h-[42px] items-center bg-black px-6 text-[13px] font-semibold text-white transition-colors hover:bg-[#ff7a3d]"
                >
                  Voir tous les articles
                </button>
              </div>
            ) : (
              <motion.div
                key={searchQuery.trim()}
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }}
                className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
              >
                {filtered.map((post) => (
                  <motion.div key={post.id} variants={heroTile} className="h-full">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group relative flex h-full flex-col bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200 transition-shadow duration-500 hover:shadow-[0_24px_60px_rgba(0,0,0,0.1)]"
                    >
                      <div className="relative h-60 overflow-hidden bg-[#f6f5f2]">
                        {post.image ? (
                          <BgImage src={post.image} className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" role="img" aria-label={post.title} />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-[#ff7a3d]/40">
                            <Newspaper className="h-14 w-14 stroke-[1.2]" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                        <span className="absolute left-5 top-5 bg-white px-3 py-1.5 text-[12px] font-semibold leading-none text-black">
                          {post.category}
                        </span>
                        <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[#ff7a3d] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                      </div>

                      <div className="flex flex-1 flex-col px-6 pb-6 pt-6">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] font-medium text-black/60">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-[#ff7a3d]" />
                            {formatDate(post.publishedAt)}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-[#ff7a3d]" />
                            {post.readTime}
                          </span>
                        </div>
                        <h3 className="mt-3 line-clamp-2 text-[18px] font-semibold leading-tight text-black transition-colors duration-300 group-hover:text-[#ff7a3d]">
                          {post.title}
                        </h3>
                        <p className="mt-3 line-clamp-3 text-[13px] font-medium leading-[1.5] text-black/70">{post.excerpt}</p>

                        <div className="mt-auto pt-6">
                          <div className="mb-5 h-px bg-gray-200" />
                          <div className="flex items-center justify-between gap-5">
                            <span className="text-[13px] font-semibold text-black">Lire l&apos;article</span>
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff7a3d] text-white transition-all duration-500 group-hover:rotate-45 group-hover:bg-black">
                              <ArrowUpRight className="h-4 w-4" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
