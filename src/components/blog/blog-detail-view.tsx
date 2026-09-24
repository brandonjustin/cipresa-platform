'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Calendar, Clock, Leaf, Newspaper, Share2, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageTransition, AnimatedSection } from '@/components/animations/motion-components';
import { formatDate } from '@/lib/utils/format';
import type { BlogPost } from '@/types';
import { BgImage } from '@/components/ui/bg-image';

function renderContent(content: string) {
  const li = 'mb-2 ml-5 pl-1 text-[16px] leading-[1.75] text-black/75 marker:text-[#ff7a3d]';
  return content.split('\n').map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('### ')) {
      return <h3 key={i} className="mb-3 mt-10 text-[20px] font-semibold leading-tight text-black">{trimmed.slice(4)}</h3>;
    }
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={i} className="mb-5 mt-12 font-display text-[26px] font-medium leading-[1.1] text-black sm:text-[30px]">
          {trimmed.slice(3)}
        </h2>
      );
    }
    if (trimmed.startsWith('- **')) {
      const match = trimmed.match(/- \*\*(.+?)\*\*(?:: (.+))?/);
      if (match) {
        return (
          <li key={i} className={`${li} list-disc`}>
            <span className="font-semibold text-black">{match[1]}</span>
            {match[2] && <> : {match[2]}</>}
          </li>
        );
      }
      return <li key={i} className={`${li} list-disc`}>{trimmed.slice(2)}</li>;
    }
    if (trimmed.startsWith('- ')) {
      return <li key={i} className={`${li} list-disc`}>{trimmed.slice(2)}</li>;
    }
    if (/^\d\. /.test(trimmed)) {
      return <li key={i} className={`${li} list-decimal marker:font-bold`}>{trimmed.slice(3)}</li>;
    }
    return <p key={i} className="mb-5 text-[16px] font-normal leading-[1.8] text-black/75 first:text-[18px] first:font-medium first:text-black">{trimmed}</p>;
  });
}

const heroItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const heroTile = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 20 } },
};

interface BlogDetailViewProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export function BlogDetailView({ post, relatedPosts }: BlogDetailViewProps) {
  const shareArticle = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, text: post.excerpt, url });
        return;
      } catch (err) {
        // The user closed the share sheet: nothing else to do.
        if (err instanceof Error && err.name === 'AbortError') return;
        // Otherwise the share failed: fall back to copying the link.
      }
    }
    await navigator.clipboard.writeText(url);
    toast.success("Lien copié !", { duration: 2000, position: "top-center" });
  };

  return (
    <PageTransition>
      <article>
        <header className="bg-[#f6f5f2] pt-[60px]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
            className="mx-auto max-w-[1520px] px-6 pb-16 pt-10 sm:px-10 lg:px-14 lg:pb-20 lg:pt-12"
          >
            <motion.div variants={heroItem}>
              <Link href="/blog" className="group inline-flex items-center gap-2.5 text-[13px] font-semibold text-black">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 transition-all duration-300 group-hover:-translate-x-0.5 group-hover:border-black group-hover:bg-black group-hover:text-white">
                  <ArrowLeft className="h-3.5 w-3.5" />
                </span>
                Retour au blog
              </Link>
            </motion.div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <div className="max-w-[920px]">
                <motion.span
                  variants={heroItem}
                  className="inline-flex items-center gap-2 bg-white px-3 py-1.5 text-[12px] font-semibold leading-none text-black ring-1 ring-black/10"
                >
                  <Newspaper className="h-3.5 w-3.5 text-[#ff7a3d]" />
                  {post.category}
                </motion.span>
                <motion.h1
                  variants={heroItem}
                  className="mt-6 font-display text-[32px] font-medium leading-[1.02] text-black sm:text-[44px] lg:text-[54px]"
                >
                  {post.title}
                </motion.h1>
              </div>

              <motion.div variants={heroItem} className="max-w-[400px]">
                {post.excerpt && <p className="text-[15px] font-medium leading-[1.55] text-black">{post.excerpt}</p>}
                <button
                  type="button"
                  onClick={shareArticle}
                  className="group mt-7 inline-flex h-[42px] min-w-[154px] items-center justify-center gap-2 bg-black px-7 text-[13px] font-semibold text-white transition-colors hover:bg-[#ff7a3d]"
                >
                  <Share2 className="h-4 w-4" />
                  Partager l&apos;article
                </button>
              </motion.div>
            </div>

            <motion.div
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
              className="mt-12 grid overflow-hidden bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:grid-cols-3"
            >
              <motion.div variants={heroTile} className="relative overflow-hidden bg-[#ff7a3d] px-7 py-6 text-white">
                <div
                  aria-hidden="true"
                  className="absolute -bottom-20 -right-8 h-[160px] w-[160px] rounded-full border border-white/35 opacity-70"
                  style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
                />
                <Calendar className="relative h-4 w-4" />
                <p className="relative mt-4 text-[20px] font-black leading-none">{formatDate(post.publishedAt, 'long')}</p>
                <p className="relative mt-1.5 text-[12px] font-medium text-white/85">Date de publication</p>
              </motion.div>

              <motion.div variants={heroTile} className="border-t border-gray-200 px-7 py-6 sm:border-l sm:border-t-0">
                <Clock className="h-4 w-4 text-[#ff7a3d]" />
                <p className="mt-4 text-[20px] font-black leading-none text-black">{post.readTime}</p>
                <p className="mt-1.5 text-[12px] font-medium text-black/60">Temps de lecture</p>
              </motion.div>

              <motion.div variants={heroTile} className="flex items-center gap-4 border-t border-gray-200 px-7 py-6 sm:border-l sm:border-t-0">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black text-[15px] font-bold text-white">
                  {post.author.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold leading-tight text-black">{post.author}</p>
                  <p className="mt-1 text-[12px] font-medium text-black/60">Expert CIPRESA</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </header>

        <div className="bg-white">
          <div className="mx-auto max-w-[1520px] px-6 py-16 sm:px-10 lg:px-14 lg:py-20">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
              <AnimatedSection>
                <div className="max-w-[760px]">{renderContent(post.content)}</div>

                <div className="mt-12 max-w-[760px] border-t border-black pt-6">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    {post.tags.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <Tag className="mr-1 h-4 w-4 text-[#ff7a3d]" />
                        {post.tags.map((tag) => (
                          <Link
                            key={tag}
                            href={`/blog?q=${encodeURIComponent(tag)}`}
                            className="bg-[#f6f5f2] px-3 py-1.5 text-[12px] font-semibold leading-none text-black transition-colors duration-300 hover:bg-black hover:text-white"
                          >
                            {tag}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <span />
                    )}
                    <button
                      type="button"
                      onClick={shareArticle}
                      className="inline-flex h-[42px] shrink-0 items-center justify-center gap-2 border border-black/20 px-6 text-[13px] font-semibold text-black transition-colors hover:border-black hover:bg-black hover:text-white"
                    >
                      <Share2 className="h-4 w-4" />
                      Partager
                    </button>
                  </div>
                </div>

                {relatedPosts.length > 0 && (
                  <div className="mt-16">
                    <div className="border-t border-black pt-8">
                      <h2 className="font-display text-[26px] font-medium leading-tight text-black sm:text-[32px]">Articles similaires</h2>
                    </div>
                    <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {relatedPosts.map((rp) => (
                        <Link
                          key={rp.id}
                          href={`/blog/${rp.slug}`}
                          className="group flex h-full flex-col bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200 transition-shadow duration-500 hover:shadow-[0_24px_60px_rgba(0,0,0,0.1)]"
                        >
                          <div className="relative h-40 overflow-hidden bg-[#f6f5f2]">
                            {rp.image && (
                              <BgImage src={rp.image} className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                            )}
                            <span className="absolute left-4 top-4 bg-white px-2.5 py-1 text-[11px] font-semibold leading-none text-black">{rp.category}</span>
                            <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[#ff7a3d] transition-transform duration-700 group-hover:scale-x-100" />
                          </div>
                          <div className="flex flex-1 flex-col p-5">
                            <h3 className="line-clamp-2 text-[15px] font-semibold leading-tight text-black transition-colors group-hover:text-[#ff7a3d]">{rp.title}</h3>
                            <p className="mt-auto pt-3 text-[12px] font-medium text-black/50">{formatDate(rp.publishedAt)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </AnimatedSection>

              <aside>
                <AnimatedSection delay={0.1} className="space-y-5 lg:sticky lg:top-24">
                  <div className="bg-[#f6f5f2] p-7">
                    <h3 className="border-t border-black pt-4 text-[13px] font-semibold text-black">À propos de l&apos;auteur</h3>
                    <div className="mt-5 flex items-center gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black text-[15px] font-bold text-white">
                        {post.author.charAt(0)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-semibold leading-tight text-black">{post.author}</p>
                        <p className="mt-1 text-[12px] font-medium text-[#ff7a3d]">Expert CIPRESA</p>
                      </div>
                    </div>
                    <div className="my-5 h-px bg-black/10" />
                    <p className="text-[13px] font-medium leading-[1.55] text-black/70">
                      Expert chez CIPRESA Consulting, dédié à la formation et l&apos;accompagnement des agriculteurs pour une agriculture performante et durable en Afrique.
                    </p>
                  </div>

                  <div className="group relative overflow-hidden bg-[#ff7a3d] p-7 text-white">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-24 -right-12 h-[210px] w-[210px] rounded-full border border-white/35 opacity-70 transition-transform duration-700 group-hover:-translate-y-3"
                      style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
                    />
                    <Leaf aria-hidden="true" className="pointer-events-none absolute right-8 top-8 h-5 w-5 fill-white text-white" />
                    <h3 className="relative max-w-[220px] font-display text-[24px] font-medium leading-[1.05]">Devenir membre CIPRESA</h3>
                    <p className="relative mt-3 text-[13px] font-medium leading-[1.55] text-white/90">
                      Accédez à toutes nos formations, ressources et conseils d&apos;experts.
                    </p>
                    <Link
                      href="/auth/register"
                      className="group/btn relative mt-6 inline-flex h-[42px] w-full items-center justify-center gap-2 bg-black text-[13px] font-semibold text-white transition-colors hover:bg-white hover:text-black"
                    >
                      S&apos;inscrire gratuitement
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-45" />
                    </Link>
                  </div>
                </AnimatedSection>
              </aside>
            </div>
          </div>
        </div>
      </article>
    </PageTransition>
  );
}
