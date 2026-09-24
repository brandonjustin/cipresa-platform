'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Clock, Users, Star, ChevronDown, Check, Plus,
  Award, BookOpen, CheckCircle, Globe, Download,
  Share2, Heart, ShoppingCart, FileText, MessageCircle,
  ArrowLeft, GraduationCap, PlayCircle, Lock, Shield, BarChart3, Loader2,
} from 'lucide-react';
import { PageTransition } from '@/components/animations/motion-components';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useProgressStore } from '@/lib/store/progress-store';
import { useCartStore } from '@/lib/store/cart-store';
import { cn } from '@/lib/utils/cn';
import { enrollInFreeCourse, submitReview } from '@/lib/actions/courses';
import { toggleWishlistItem } from '@/lib/actions/wishlist';
import type { Course, Review, Section } from '@/types';
import { BgImage } from '@/components/ui/bg-image';

const faqData = [
  { q: 'Quels sont les prérequis pour ce cours ?', a: 'Aucun prérequis spécifique. Le cours est conçu pour les débutants comme pour les professionnels souhaitant approfondir leurs connaissances.' },
  { q: 'Comment accéder au cours après achat ?', a: 'L\'accès est immédiat après paiement. Vous retrouverez le cours dans votre tableau de bord, section Mes formations.' },
  { q: 'Le certificat est-il reconnu ?', a: 'Oui, le certificat CIPRESA atteste de vos compétences et est reconnu par nos partenaires institutionnels.' },
  { q: 'Puis-je télécharger les ressources ?', a: 'Oui, toutes les ressources complémentaires (PDF, fiches techniques) sont téléchargeables depuis la plateforme.' },
];

const levelLabels: Record<Course['level'], string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé',
  all: 'Tous niveaux',
};

/** "1 leçon", "3 leçons" */
function plural(count: number, word: string) {
  return `${count} ${word}${count > 1 ? 's' : ''}`;
}

const heroItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

interface CourseDetailViewProps {
  course: Course;
  sections: Section[];
  reviews: Review[];
  isAuthenticated: boolean;
  isEntitled: boolean;
  completedLessonIds: string[];
  initialIsWishlisted: boolean;
}

export function CourseDetailView({
  course,
  sections,
  reviews,
  isAuthenticated,
  isEntitled,
  completedLessonIds,
  initialIsWishlisted,
}: CourseDetailViewProps) {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState<string[]>(sections[0] ? [sections[0].id] : []);
  const [activeTab, setActiveTab] = useState('content');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  const hydrate = useProgressStore((s) => s.hydrate);
  const isCompleted = useProgressStore((s) => s.isCompleted);
  const completedCount = useProgressStore((s) => s.getCompletedCount(course.id));
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    hydrate(course.id, completedLessonIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.id]);

  const allLessons = sections.flatMap((s) => s.lessons);
  const totalLessons = allLessons.length;
  const firstLessonId = allLessons[0]?.id;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const handlePrimaryAction = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?next=/course/${course.slug}`);
      return;
    }
    if (isEntitled) {
      router.push(`/course/${course.slug}/learn${firstLessonId ? `?lesson=${firstLessonId}` : ''}`);
      return;
    }
    if (course.price === 0) {
      setIsEnrolling(true);
      try {
        await enrollInFreeCourse(course.id);
        toast.success('Inscription confirmée !');
        router.push(`/course/${course.slug}/learn${firstLessonId ? `?lesson=${firstLessonId}` : ''}`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Une erreur est survenue.');
      } finally {
        setIsEnrolling(false);
      }
      return;
    }
    addItem({
      id: `course-${course.id}`,
      type: 'course',
      itemId: course.id,
      name: course.title,
      price: course.salePrice ?? course.price,
      quantity: 1,
      image: course.thumbnail,
    });
    toast.success('Ajouté au panier !');
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?next=/course/${course.slug}`);
      return;
    }
    setIsTogglingWishlist(true);
    const previous = isWishlisted;
    setIsWishlisted(!previous);
    try {
      const saved = await toggleWishlistItem('course', course.id);
      setIsWishlisted(saved);
      toast.success(saved ? 'Ajouté à vos favoris' : 'Retiré de vos favoris');
    } catch (err) {
      setIsWishlisted(previous);
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: course.title, url });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
      }
    }
    await navigator.clipboard.writeText(url);
    toast.success('Lien copié !');
  };

  const primaryLabel = !isAuthenticated
    ? 'Se connecter pour commencer'
    : isEntitled
      ? 'Continuer le cours'
      : course.price === 0
        ? 'Commencer le cours'
        : 'Ajouter au panier';

  return (
    <PageTransition>
      <div className="pt-[60px]">
        <section className="bg-[#f6f5f2]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }}
            className="mx-auto max-w-[1520px] px-6 pb-16 pt-8 sm:px-10 lg:px-14 lg:pb-20 lg:pt-10"
          >
            <motion.div variants={heroItem}>
              <Link href="/courses" className="group inline-flex items-center gap-2.5 text-[13px] font-semibold text-black">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 transition-all duration-300 group-hover:-translate-x-0.5 group-hover:border-black group-hover:bg-black group-hover:text-white">
                  <ArrowLeft className="h-3.5 w-3.5" />
                </span>
                Retour aux formations
              </Link>
            </motion.div>

            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-14">
              {/* Left: course identity */}
              <div>
                <motion.div variants={heroItem}>
                  <Link
                    href={`/courses?category=${course.category.slug}`}
                    className="inline-flex items-center gap-2 bg-white px-3 py-1.5 text-[12px] font-semibold leading-none text-black ring-1 ring-black/10 transition-colors hover:bg-black hover:text-white"
                  >
                    <GraduationCap className="h-3.5 w-3.5 text-[#ff7a3d]" />
                    {course.category.name}
                  </Link>
                </motion.div>
                <motion.h1
                  variants={heroItem}
                  className="mt-6 font-display text-[34px] font-medium leading-[1] text-black sm:text-[46px] lg:text-[56px]"
                >
                  {course.title}
                </motion.h1>
                <motion.p variants={heroItem} className="mt-5 max-w-[620px] text-[16px] font-medium leading-[1.6] text-black/75">
                  {course.shortDescription}
                </motion.p>

                {/* Key facts strip */}
                <motion.div
                  variants={heroItem}
                  className="mt-8 grid grid-cols-2 overflow-hidden bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:grid-cols-3 xl:grid-cols-5"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('reviews');
                      document.getElementById('contenu-cours')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="relative col-span-2 overflow-hidden bg-[#ff7a3d] px-6 py-5 text-left text-white sm:col-span-1"
                  >
                    <div
                      aria-hidden="true"
                      className="absolute -bottom-16 -right-8 h-[130px] w-[130px] rounded-full border border-white/35 opacity-70"
                      style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '10px 10px' }}
                    />
                    <p className="relative flex items-center gap-1.5 text-[26px] font-black leading-none">
                      {course.rating > 0 ? course.rating.toFixed(1) : '—'}
                      <Star className="h-4 w-4 fill-white text-white" />
                    </p>
                    <p className="relative mt-1.5 text-[12px] font-medium text-white/85">{course.totalReviews} avis · voir</p>
                  </button>
                  {[
                    { icon: Users, value: String(course.totalStudents), label: 'Étudiants' },
                    { icon: Clock, value: course.duration, label: 'Durée' },
                    { icon: BarChart3, value: levelLabels[course.level], label: 'Niveau' },
                    { icon: Globe, value: course.language, label: 'Langue' },
                  ].map((fact) => (
                    <div key={fact.label} className="border-l border-t border-gray-200 px-5 py-5 sm:border-t-0 [&:nth-child(2)]:border-l-0 sm:[&:nth-child(2)]:border-l xl:border-t-0">
                      <fact.icon className="h-4 w-4 text-[#ff7a3d]" />
                      <p className="mt-3 truncate text-[15px] font-bold leading-tight text-black">{fact.value}</p>
                      <p className="mt-1 text-[11px] font-medium text-black/50">{fact.label}</p>
                    </div>
                  ))}
                </motion.div>

                {/* Instructor */}
                <motion.div variants={heroItem} className="mt-8 flex flex-wrap items-center gap-4 border-t border-black pt-6">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black text-[15px] font-bold text-white">
                    {course.instructor.fullName.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold leading-tight text-black">{course.instructor.fullName}</p>
                    <p className="mt-1 text-[12px] font-medium text-black/55">{course.instructor.title}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex h-[42px] items-center gap-2 border border-black/20 bg-white px-5 text-[13px] font-semibold text-black transition-colors hover:border-black hover:bg-black hover:text-white"
                  >
                    <Share2 className="h-4 w-4" />
                    Partager
                  </button>
                </motion.div>
              </div>

              {/* Right: purchase card */}
              <motion.aside variants={heroItem} className="lg:sticky lg:top-24 lg:self-start">
                <div className="overflow-hidden bg-white shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
                  <div className="relative aspect-video overflow-hidden bg-black">
                    {course.thumbnail && (
                      <BgImage src={course.thumbnail} className="absolute inset-0" sizes="(min-width: 1024px) 480px, 100vw" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    {course.price === 0 && (
                      <span className="absolute left-4 top-4 bg-[#ff7a3d] px-2.5 py-1 text-[11px] font-semibold leading-none text-white">Gratuit</span>
                    )}
                    <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 text-[12px] font-semibold text-white">
                      <PlayCircle className="h-5 w-5" />
                      {totalLessons} leçon{totalLessons > 1 ? 's' : ''} vidéo
                    </span>
                  </div>

                  <div className="p-6 lg:p-7">
                    <div className="flex flex-wrap items-baseline gap-x-2.5">
                      <p className="text-[34px] font-black leading-none text-black">
                        {course.price === 0 ? 'Gratuit' : formatCurrency(course.salePrice ?? course.price, course.currency)}
                      </p>
                      {course.price > 0 && course.salePrice != null && course.salePrice < course.price && (
                        <p className="text-[14px] font-medium text-black/40 line-through">{formatCurrency(course.price, course.currency)}</p>
                      )}
                    </div>

                    {isEntitled && totalLessons > 0 && (
                      <div className="mt-5">
                        <div className="flex items-center justify-between text-[12px] font-semibold text-black">
                          <span>Votre progression</span>
                          <span>{progressPct}%</span>
                        </div>
                        <div className="mt-2 h-1.5 bg-[#f6f5f2]">
                          <motion.div
                            className="h-full bg-[#ff7a3d]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPct}%` }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handlePrimaryAction}
                      disabled={isEnrolling}
                      className="group relative mt-6 flex h-[52px] w-full items-center justify-center gap-2 overflow-hidden bg-[#ff7a3d] text-[14px] font-semibold text-white transition-colors duration-300 hover:bg-black disabled:opacity-70"
                    >
                      {isEnrolling ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : isEntitled ? (
                        <PlayCircle className="h-5 w-5" />
                      ) : course.price === 0 ? (
                        <Play className="h-5 w-5" />
                      ) : (
                        <ShoppingCart className="h-5 w-5" />
                      )}
                      {primaryLabel}
                    </button>
                    <button
                      type="button"
                      onClick={handleToggleWishlist}
                      disabled={isTogglingWishlist}
                      aria-pressed={isWishlisted}
                      className={cn(
                        'mt-3 flex h-[46px] w-full items-center justify-center gap-2 text-[13px] font-semibold transition-colors duration-300',
                        isWishlisted ? 'bg-[#ff7a3d]/10 text-[#c2521f]' : 'border border-black/15 text-black hover:border-black hover:bg-black hover:text-white'
                      )}
                    >
                      {isTogglingWishlist ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={cn('h-4 w-4', isWishlisted && 'fill-current')} />}
                      {isWishlisted ? 'Dans vos favoris' : 'Ajouter aux favoris'}
                    </button>

                    <p className="mt-4 flex items-center gap-2 text-[12px] font-medium text-black/55">
                      <Shield className="h-3.5 w-3.5 text-emerald-600" />
                      Paiement sécurisé & Satisfaction garantie
                    </p>

                    <dl className="mt-6 grid grid-cols-3 gap-px overflow-hidden bg-gray-200 ring-1 ring-gray-200">
                      {[
                        { icon: FileText, label: 'Leçons', value: String(totalLessons) },
                        { icon: Clock, label: 'Durée', value: course.duration },
                        { icon: Award, label: 'Certificat', value: 'Oui' },
                      ].map((item) => (
                        <div key={item.label} className="bg-white px-3 py-4 text-center">
                          <item.icon className="mx-auto h-4 w-4 text-[#ff7a3d]" />
                          <dd className="mt-2 truncate text-[14px] font-bold text-black">{item.value}</dd>
                          <dt className="mt-0.5 text-[11px] font-medium text-black/50">{item.label}</dt>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </motion.aside>
            </div>
          </motion.div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-[1520px] px-6 py-14 sm:px-10 lg:px-14 lg:py-16">
            {/* Tabs */}
            <div id="contenu-cours" className="scroll-mt-24 border-b border-gray-200">
              <div role="tablist" aria-label="Sections du cours" className="-mb-px flex gap-6 overflow-x-auto scrollbar-hide sm:gap-9">
                {[
                  { id: 'content', label: 'Contenu' },
                  { id: 'reviews', label: `Avis (${reviews.length})` },
                  { id: 'instructor', label: 'Formateur' },
                  { id: 'faq', label: 'FAQ' },
                ].map((tab) => {
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'relative shrink-0 pb-4 text-[14px] font-semibold whitespace-nowrap transition-colors duration-300',
                        active ? 'text-black' : 'text-black/45 hover:text-black'
                      )}
                    >
                      {tab.label}
                      {active && (
                        <motion.span layoutId="course-tab-underline" className="absolute inset-x-0 -bottom-px h-[3px] bg-[#ff7a3d]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                role="tabpanel"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="pt-10"
              >
                {activeTab === 'content' && (
                  <div className="grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-14">
                    <div className="space-y-14">
                      {/* What you'll learn */}
                      {course.whatYouWillLearn.length > 0 && (
                        <div>
                          <h2 className="font-display text-[26px] font-medium leading-[1] text-black sm:text-[32px]">Ce que vous apprendrez</h2>
                          <ul className="mt-6 grid gap-px overflow-hidden bg-gray-200 ring-1 ring-gray-200 sm:grid-cols-2">
                            {course.whatYouWillLearn.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3 bg-white px-5 py-4">
                                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff7a3d]/10 text-[#ff7a3d]">
                                  <Check className="h-3.5 w-3.5" />
                                </span>
                                <span className="text-[14px] font-medium leading-snug text-black">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Curriculum */}
                      <div>
                        <div className="flex flex-wrap items-end justify-between gap-3">
                          <h2 className="font-display text-[26px] font-medium leading-[1] text-black sm:text-[32px]">Contenu du cours</h2>
                          <p className="text-[13px] font-medium text-black/55">
                            {sections.length} section{sections.length > 1 ? 's' : ''} · {plural(totalLessons, 'leçon')}
                          </p>
                        </div>

                        {isEntitled && totalLessons > 0 && (
                          <div className="mt-6 bg-[#f6f5f2] p-5">
                            <div className="flex items-center justify-between text-[13px] font-semibold text-black">
                              <span className="inline-flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-[#ff7a3d]" /> Ma progression
                              </span>
                              <span>{progressPct}%</span>
                            </div>
                            <div className="mt-3 h-1.5 bg-white">
                              <div className="h-full bg-[#ff7a3d] transition-all duration-700" style={{ width: `${progressPct}%` }} />
                            </div>
                            <p className="mt-2 text-[12px] font-medium text-black/55">
                              {completedCount}/{totalLessons} leçons complétées
                            </p>
                          </div>
                        )}

                        <div className="mt-6 grid gap-px overflow-hidden bg-gray-200 ring-1 ring-gray-200">
                          {sections.map((section, sIdx) => {
                            const open = expandedSections.includes(section.id);
                            return (
                              <div key={section.id} className="bg-white">
                                <button
                                  type="button"
                                  onClick={() => toggleSection(section.id)}
                                  aria-expanded={open}
                                  className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[#fbfaf8]"
                                >
                                  <span className={cn('w-7 shrink-0 text-[18px] font-black leading-none transition-colors', open ? 'text-[#ff7a3d]' : 'text-black/25')}>
                                    {String(sIdx + 1).padStart(2, '0')}
                                  </span>
                                  <span className="flex-1 text-[15px] font-semibold text-black">{section.title}</span>
                                  <span className="text-[12px] font-medium text-black/50">{plural(section.lessons.length, 'leçon')}</span>
                                  <span
                                    className={cn(
                                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300',
                                      open ? 'rotate-180 bg-[#ff7a3d] text-white' : 'border border-black/15 text-black group-hover:border-black'
                                    )}
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </span>
                                </button>

                                <AnimatePresence initial={false}>
                                  {open && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                      className="overflow-hidden"
                                    >
                                      <div className="border-t border-gray-100">
                                        {section.lessons.length === 0 && (
                                          <p className="px-5 py-4 pl-16 text-[13px] font-medium text-black/45">Leçons bientôt disponibles.</p>
                                        )}
                                        {section.lessons.map((lesson) => {
                                          const completed = isEntitled && isCompleted(course.id, lesson.id);
                                          const accessible = lesson.isPreview || isEntitled;
                                          const rowClassName = cn(
                                            'flex items-center gap-3 border-b border-gray-100 px-5 py-3.5 pl-16 last:border-0',
                                            accessible && 'transition-colors hover:bg-[#f6f5f2]'
                                          );
                                          const rowContent = (
                                            <>
                                              {completed ? (
                                                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                                              ) : accessible ? (
                                                <PlayCircle className="h-4 w-4 shrink-0 text-[#ff7a3d]" />
                                              ) : (
                                                <Lock className="h-4 w-4 shrink-0 text-black/30" />
                                              )}
                                              <span className={cn('flex-1 text-[14px] font-medium', completed ? 'text-black/45 line-through' : 'text-black')}>
                                                {lesson.title}
                                              </span>
                                              {lesson.isPreview && !isEntitled && (
                                                <span className="bg-[#ff7a3d] px-2 py-0.5 text-[11px] font-semibold text-white">Aperçu</span>
                                              )}
                                              {completed && <span className="bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">Fait</span>}
                                              <span className="w-12 text-right text-[12px] font-medium tabular-nums text-black/45">{lesson.videoDuration}</span>
                                            </>
                                          );
                                          return accessible ? (
                                            <Link key={lesson.id} href={`/course/${course.slug}/learn?lesson=${lesson.id}`} className={rowClassName}>
                                              {rowContent}
                                            </Link>
                                          ) : (
                                            <div key={lesson.id} className={rowClassName}>
                                              {rowContent}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                          {sections.length === 0 && (
                            <p className="bg-white px-5 py-10 text-center text-[14px] font-medium text-black/55">Le contenu de ce cours sera bientôt disponible.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Includes */}
                    <aside className="lg:sticky lg:top-24 lg:self-start">
                      <div className="relative overflow-hidden bg-[#f6f5f2] p-7">
                        <h3 className="border-t border-black pt-4 text-[13px] font-semibold text-black">Ce cours inclut</h3>
                        <ul className="mt-5 space-y-4">
                          {[
                            { icon: Play, label: `${course.totalHours}h de vidéo` },
                            { icon: FileText, label: plural(totalLessons, 'leçon') },
                            { icon: Download, label: 'Ressources téléchargeables' },
                            { icon: Award, label: 'Certificat de fin' },
                            { icon: MessageCircle, label: 'Accès à la communauté' },
                          ].map((item) => (
                            <li key={item.label} className="flex items-center gap-3 text-[14px] font-medium text-black">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#ff7a3d]">
                                <item.icon className="h-4 w-4" />
                              </span>
                              {item.label}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </aside>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <ReviewsTab course={course} reviews={reviews} isAuthenticated={isAuthenticated} isEntitled={isEntitled} />
                )}

                {activeTab === 'instructor' && (
                  <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-14">
                    <div className="relative overflow-hidden bg-[#ff7a3d] p-8 text-white">
                      <div
                        aria-hidden="true"
                        className="absolute -bottom-24 -right-12 h-[230px] w-[230px] rounded-full border border-white/35 opacity-70"
                        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
                      />
                      <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white font-display text-[34px] font-medium text-[#ff7a3d]">
                        {course.instructor.fullName.charAt(0)}
                      </span>
                      <h2 className="relative mt-6 font-display text-[30px] font-medium leading-[1.02]">{course.instructor.fullName}</h2>
                      <p className="relative mt-2 text-[14px] font-medium text-white/90">{course.instructor.title}</p>
                      <div className="relative mt-8 grid grid-cols-3 gap-px overflow-hidden bg-white/25">
                        {[
                          { icon: BookOpen, value: course.instructor.totalCourses, label: 'Cours' },
                          { icon: Users, value: course.instructor.totalStudents, label: 'Étudiants' },
                          { icon: Star, value: course.instructor.rating, label: 'Note' },
                        ].map((s) => (
                          <div key={s.label} className="bg-[#ff7a3d] py-4 text-center">
                            <s.icon className="mx-auto h-4 w-4" />
                            <p className="mt-2 text-[18px] font-black leading-none">{s.value}</p>
                            <p className="mt-1 text-[11px] font-medium text-white/85">{s.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="border-t border-black pt-4 text-[13px] font-semibold text-black">À propos du formateur</h3>
                      <p className="mt-5 text-[16px] font-medium leading-[1.7] text-black/75">{course.instructor.bio}</p>
                      {course.instructor.expertise.length > 0 && (
                        <>
                          <h3 className="mt-10 text-[12px] font-semibold text-black/50">Domaines d&apos;expertise</h3>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {course.instructor.expertise.map((exp) => (
                              <span key={exp} className="bg-[#f6f5f2] px-3 py-1.5 text-[12px] font-semibold text-black">
                                {exp}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'faq' && (
                  <div className="max-w-[860px]">
                    <div className="grid gap-px overflow-hidden bg-gray-200 ring-1 ring-gray-200">
                      {faqData.map((item, idx) => (
                        <details key={idx} className="group bg-white">
                          <summary className="flex cursor-pointer items-center gap-4 px-5 py-5 transition-colors hover:bg-[#fbfaf8] [&::-webkit-details-marker]:hidden">
                            <span className="w-7 shrink-0 text-[18px] font-black leading-none text-black/25 transition-colors group-open:text-[#ff7a3d]">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <span className="flex-1 text-[15px] font-semibold text-black">{item.q}</span>
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/15 text-black transition-all duration-300 group-open:rotate-45 group-open:border-[#ff7a3d] group-open:bg-[#ff7a3d] group-open:text-white">
                              <Plus className="h-4 w-4" />
                            </span>
                          </summary>
                          <p className="border-t border-gray-100 px-5 py-5 pl-16 text-[14px] font-medium leading-[1.65] text-black/70">{item.a}</p>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

function ReviewsTab({
  course,
  reviews,
  isAuthenticated,
  isEntitled,
}: {
  course: Course;
  reviews: Review[];
  isAuthenticated: boolean;
  isEntitled: boolean;
}) {
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Écrivez quelques mots sur votre expérience.');
      return;
    }
    setIsSubmitting(true);
    try {
      await submitReview({ targetId: course.id, targetType: 'course', rating, comment: comment.trim() });
      setSubmitted(true);
      toast.success('Merci pour votre avis ! Il sera visible après modération.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const shown = hovered ?? rating;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
      <div>
        <div className="flex items-center gap-4">
          <p className="text-[52px] font-black leading-none text-black">{course.rating.toFixed(1)}</p>
          <div>
            <div className="flex gap-0.5" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={cn('h-5 w-5', i < Math.round(course.rating) ? 'fill-[#ff7a3d] text-[#ff7a3d]' : 'fill-black/10 text-black/10')} />
              ))}
            </div>
            <p className="mt-1.5 text-[12px] font-medium text-black/55">{course.totalReviews} avis</p>
          </div>
        </div>

        <div className="mt-8">
          {!isAuthenticated ? (
            <div className="bg-[#f6f5f2] p-6">
              <p className="text-[14px] font-medium text-black">Vous avez suivi ce cours ?</p>
              <p className="mt-1 text-[13px] font-medium text-black/55">Connectez-vous pour publier un avis.</p>
              <Link
                href={`/auth/login?next=/course/${course.slug}`}
                className="mt-5 inline-flex h-[42px] items-center bg-black px-6 text-[13px] font-semibold text-white transition-colors hover:bg-[#ff7a3d]"
              >
                Se connecter
              </Link>
            </div>
          ) : !isEntitled ? (
            <p className="bg-[#f6f5f2] p-6 text-[13px] font-medium text-black/60">
              Seuls les apprenants inscrits à ce cours peuvent publier un avis.
            </p>
          ) : submitted ? (
            <div className="flex items-start gap-3 bg-emerald-50 p-5">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <p className="text-[14px] font-medium text-emerald-800">Merci pour votre avis ! Il sera visible après modération.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-[#f6f5f2] p-6">
              <p className="text-[12px] font-semibold text-black/50">Votre note</p>
              <div className="mt-2 flex gap-1" role="radiogroup" aria-label="Votre note" onMouseLeave={() => setHovered(null)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={rating === n}
                    aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHovered(n)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star className={cn('h-7 w-7', n <= shown ? 'fill-[#ff7a3d] text-[#ff7a3d]' : 'fill-black/10 text-black/10')} />
                  </button>
                ))}
              </div>
              <label htmlFor="course-review" className="mt-5 block text-[12px] font-semibold text-black/50">
                Votre avis
              </label>
              <textarea
                id="course-review"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Partagez votre expérience..."
                rows={4}
                className="mt-2 w-full resize-none bg-white px-4 py-3 text-[14px] font-medium text-black ring-1 ring-transparent transition-all placeholder:text-black/35 hover:ring-black/15 focus:outline-none focus:ring-2 focus:ring-[#ff7a3d]"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 inline-flex h-[42px] items-center justify-center gap-2 bg-[#ff7a3d] px-6 text-[13px] font-semibold text-white transition-colors hover:bg-black disabled:opacity-60"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Publier mon avis
              </button>
            </form>
          )}
        </div>
      </div>

      <div>
        {reviews.length === 0 ? (
          <div className="flex h-full min-h-[220px] flex-col items-center justify-center bg-[#f6f5f2] px-6 py-12 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ff7a3d]/10 text-[#ff7a3d]">
              <Star className="h-6 w-6" />
            </span>
            <p className="mt-4 text-[15px] font-semibold text-black">Aucun avis pour le moment.</p>
            <p className="mt-1 text-[13px] font-medium text-black/55">Les avis des apprenants apparaîtront ici.</p>
          </div>
        ) : (
          <ul className="grid gap-px overflow-hidden bg-gray-200 ring-1 ring-gray-200">
            {reviews.map((review) => (
              <li key={review.id} className="flex gap-4 bg-white px-6 py-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-[14px] font-bold text-white">
                  {review.userName.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[14px] font-semibold text-black">{review.userName}</p>
                    <span className="text-[12px] font-medium text-black/45">{formatDate(review.createdAt, 'short')}</span>
                  </div>
                  <div className="mt-1.5 flex gap-0.5" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn('h-3.5 w-3.5', i < review.rating ? 'fill-[#ff7a3d] text-[#ff7a3d]' : 'fill-black/10 text-black/10')} />
                    ))}
                  </div>
                  <p className="mt-2 text-[14px] font-medium leading-[1.55] text-black/75">{review.comment}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
