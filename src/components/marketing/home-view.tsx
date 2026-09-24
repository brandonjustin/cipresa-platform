'use client';

import { Fragment, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  BookOpenText,
  Building2,
  CloudSun,
  GraduationCap,
  Handshake,
  Heart,
  Leaf,
  Quote,
  Rocket,
  ShieldCheck,
  ShoppingCart,
  Star,
  Timer,
  Tractor,
  TrendingUp,
  Users,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatCurrency } from '@/lib/utils/format';
import { useCartStore } from '@/lib/store/cart-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { getCurrentUserWishlistedProductIds, toggleWishlistItem } from '@/lib/actions/wishlist';
import type { Course, CourseCategory, Product } from '@/types';

const services = [
  {
    icon: GraduationCap,
    title: 'Formation agricole',
    text: 'Parcours courts, cas pratiques et certifications pour progresser vite.',
    action: 'Apprendre',
    result: 'Monter en competence',
    image: '/images/hero/training-hero.jpg',
    href: '/courses',
  },
  {
    icon: Leaf,
    title: 'Semences & intrants',
    text: 'Des produits selectionnes pour les conditions de production locales.',
    action: 'Acheter',
    result: 'Produire avec les bons intrants',
    image: '/images/categories/seeds.jpg',
    href: '/marketplace',
  },
  {
    icon: Wrench,
    title: 'Equipement & services',
    text: 'Outillage, irrigation et assistance pour fiabiliser les operations.',
    action: 'Equiper',
    result: 'Stabiliser les operations',
    image: '/images/categories/irrigation.jpg',
    href: '/services',
  },
  {
    icon: BookOpenText,
    title: 'Projets & expertise',
    text: 'Etudes, modeles economiques et suivi pour transformer une idee en ferme rentable.',
    action: 'Structurer',
    result: 'Passer de l idee au projet rentable',
    image: '/images/categories/project.jpg',
    href: '/contact',
  },
];

const benefits = [
  {
    icon: Users,
    title: 'Experts terrain',
    text: 'Une equipe agricole presente sur le terrain pour valider chaque recommandation.',
  },
  {
    icon: Handshake,
    title: 'Accompagnement clair',
    text: 'Des plans d action adaptes a votre niveau, votre budget et votre calendrier.',
  },
  {
    icon: Tractor,
    title: 'Pratiques modernes',
    text: 'Technologies, donnees et methodes durables pour ameliorer les rendements.',
  },
  {
    icon: CloudSun,
    title: 'Climat africain',
    text: 'Des solutions pensees pour la chaleur, la saisonnalite et les sols locaux.',
  },
  {
    icon: TrendingUp,
    title: 'Marche inclus',
    text: 'Un accompagnement qui va de la production a la commercialisation.',
  },
];

const process = [
  ['01', 'Diagnostic', 'Nous cadrons vos objectifs, vos contraintes et vos opportunites.'],
  ['02', 'Plan', 'Nous construisons un parcours, un panier ou une feuille de route projet.'],
  ['03', 'Execution', 'Vous passez a l action avec des ressources, produits et experts disponibles.'],
  ['04', 'Suivi', 'Les resultats sont mesures, optimises et documentes dans le temps.'],
];

const methodPillars = [
  { label: 'Conseil', icon: Handshake },
  { label: 'Formation', icon: GraduationCap },
  { label: 'Intrants', icon: Leaf },
  { label: 'Suivi', icon: TrendingUp },
];

const testimonials = [
  {
    name: 'Jean Paul Mbarga',
    role: 'Agriculteur - Bafoussam, Cameroun',
    avatar: '/images/testimonials/user1.jpg',
    text: 'Grace a CIPRESA, j ai ameliore mes rendements de 60% en culture du mais et je peux acceder a de nouveaux marches.',
  },
  {
    name: 'Aissatou Diallo',
    role: 'Entrepreneure Agricole - Bamako, Mali',
    avatar: '/images/testimonials/user2.jpg',
    text: 'La formation m a permis de structurer mon projet et d obtenir un financement. Aujourd hui, mon exploitation prospere.',
  },
  {
    name: 'Kouadio Yao',
    role: 'Producteur de cacao - Divo, Cote d Ivoire',
    avatar: '/images/testimonials/user3.jpg',
    text: 'Un accompagnement professionnel de bout en bout. CIPRESA est un veritable partenaire de croissance.',
  },
];

const courseBadges = ['Populaire', 'Pratique', 'Nouveau', 'Tendance'];
const productBadges = ['En stock', 'Populaire', 'Nouveau', 'Promo'];

const trustCategories = [
  { icon: Users, label: 'Cooperatives agricoles' },
  { icon: Tractor, label: 'Exploitations familiales' },
  { icon: Handshake, label: 'ONG & bailleurs' },
  { icon: GraduationCap, label: 'Instituts de formation' },
  { icon: Rocket, label: 'Agri-entrepreneurs' },
  { icon: Building2, label: 'Institutions publiques' },
];

const heroHeadline = 'Transformer vos projets agricoles en resultats mesurables.';
const heroHighlightWords = new Set(['resultats', 'mesurables.']);

const viewport = { once: true, margin: '-80px' };

const sectionReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const itemReveal = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const staggerReveal = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};

// Word-by-word "mask reveal" for the hero headline: each word slides up out
// of a clipped wrapper. Inherits hidden/visible from the parent stagger
// container above it, so it still respects that container's own delay.
const headlineContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const headlineWord = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const serviceCardReveal = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const servicesSectionReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const springUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 80, damping: 20, delay: i * 0.12 },
  }),
};

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 1500;
    let raf: number;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return <span ref={ref}>{display}{suffix}</span>;
}

/** Headline whose words slide up out of clipped wrappers one after another.
 * Driven by the parent's hidden/visible variants. */
function MaskedHeadline({ text, highlight, className }: { text: string; highlight?: Set<string>; className?: string }) {
  const words = text.split(' ');
  return (
    <motion.h1 variants={headlineContainer} aria-label={text} className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span aria-hidden="true" className="inline-block overflow-hidden pb-1 align-top">
            <motion.span variants={headlineWord} className={cn('inline-block', highlight?.has(word) && 'text-[#ff7a3d]')}>
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </motion.h1>
  );
}

function CoverImage({ src, alt, sizes, className }: { src: string; alt: string; sizes: string; className?: string }) {
  if (!src) {
    return <div className={cn('bg-gradient-to-br from-cipresa-100 via-white to-africa-dawn/25', className)} />;
  }
  return <Image src={src} alt={alt} fill sizes={sizes} className={cn('object-cover', className)} />;
}

/** Service card in the "Cultivez votre projet" language: a flat tile with a
 * bold index number, a hairline divider and the orange round arrow button.
 * On hover the tile floods orange and the dotted circle rises into view. */
function ServiceCard({ service, index }: { service: (typeof services)[number]; index: number }) {
  return (
    <motion.div variants={serviceCardReveal} className="h-full">
      <Link
        href={service.href}
        className="group relative flex h-full min-h-[300px] flex-col overflow-hidden bg-white px-7 py-8 text-black transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#ff7a3d] hover:text-white lg:min-h-[340px] lg:px-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -right-16 h-[230px] w-[230px] translate-y-10 rounded-full border border-white/35 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-70"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
        />
        <Leaf
          aria-hidden="true"
          className="pointer-events-none absolute right-[30%] top-24 h-4 w-4 scale-50 fill-white text-white opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100"
        />

        <div className="relative flex items-start justify-between gap-6">
          <p className="text-[34px] font-black leading-none">{String(index + 1).padStart(2, '0')}</p>
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 transition-colors duration-500 group-hover:border-white/50">
            <service.icon className="h-5 w-5 stroke-[1.7]" />
          </span>
        </div>

        <div className="relative mt-auto pt-16">
          <h3 className="text-[18px] font-semibold leading-tight">{service.title}</h3>
          <div className="my-6 h-px bg-gray-200 transition-colors duration-500 group-hover:bg-white/35" />
          <div className="flex items-end justify-between gap-5">
            <p className="max-w-[210px] text-[12px] font-medium leading-tight opacity-80 group-hover:opacity-100">{service.text}</p>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff7a3d] text-white transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-[#ff7a3d]">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

const heroStats = [
  { count: 96, suffix: '%', label: 'Satisfaction' },
  { count: 2, suffix: 'K+', label: 'Apprenants actifs' },
  { count: 500, suffix: '+', label: 'Projets suivis' },
];

// Fanned "dealt from a deck" photo stack for the hero visual, in the spirit
// of the reference card-fan animation. Each entry pairs a real CIPRESA photo
// with its resting position (x/y offset, rotation, scale, stacking order).
const heroStackPhotos = [
  { src: '/images/6014849480848510225.jpg', alt: 'Briefing terrain avec un consultant CIPRESA' },
  { src: '/images/6014849480848510224.jpg', alt: 'Recolte d avocats accompagnee par CIPRESA' },
  { src: '/images/hero/award-ceremony.jpg', alt: 'Un consultant CIPRESA recompense pour son engagement aupres des producteurs' },
  { src: '/images/6014849480848510229.jpg', alt: 'Equipe CIPRESA en deplacement sur une exploitation' },
  { src: '/images/6014849480848510226.jpg', alt: 'Membre de l equipe CIPRESA sur le terrain' },
] as const;

const heroCardFanLayout = [
  { x: -136, y: 26, rotate: -13, scale: 0.88, z: 10 },
  { x: -68, y: 8, rotate: -6, scale: 0.94, z: 20 },
  { x: 0, y: 0, rotate: 0, scale: 1, z: 30 },
  { x: 68, y: 8, rotate: 6, scale: 0.94, z: 20 },
  { x: 136, y: 26, rotate: 13, scale: 0.88, z: 10 },
] as const;

// Per-card "story" swapped into the banner (tag, headline, copy, ambient
// background tint + photo) when that card is clicked — same order as
// heroStackPhotos.
const heroStories = [
  {
    tag: 'Accompagnement terrain',
    headline: 'Un accompagnement de terrain, pas de bureau.',
    text: 'Nos consultants sont presents a vos cotes a chaque etape, du diagnostic jusqu aux premiers resultats.',
    accent: '#B7791F',
  },
  {
    tag: 'Filiere avocat',
    headline: 'Des recoltes qui tiennent leurs promesses.',
    text: 'De la selection des plants a la recolte, nous structurons chaque etape pour securiser le rendement.',
    accent: '#b67831',
  },
  {
    tag: 'Reconnaissance SGBC Awards',
    headline: 'Une expertise reconnue au Cameroun.',
    text: 'CIPRESA a ete distingue pour son engagement aupres des producteurs et son impact mesurable.',
    accent: '#F6B13D',
  },
  {
    tag: 'Suivi terrain',
    headline: 'Une equipe mobilisee sur chaque exploitation.',
    text: 'Nos experts se deplacent directement sur vos parcelles pour un suivi reel, pas seulement theorique.',
    accent: '#1f63b5',
  },
  {
    tag: 'Expertise locale',
    headline: 'Des consultants formes aux realites locales.',
    text: 'Chaque membre de l equipe CIPRESA comprend les contraintes concretes de l agriculture africaine.',
    accent: '#7C4A2D',
  },
] as const;

// Ambient backdrop shown behind the banner when no card is focused — slowly
// cross-fades through this rotation instead of a single static image.
// Replaced by the clicked card's own photo (see the background crossfade
// below) whenever a card is active, then resumes once deselected.
const HERO_SLIDE_MS = 6000;

const heroAmbientBackgrounds = [
  '/images/6030493783260073404.jpg',
  '/images/tomato.jpg',
  '/images/groupe.jpg',
  '/images/6030493783260073398.jpg',
  '/images/banner-back.png',
] as const;

/** Resting transform for a hero card: the idle fan when nothing is
 * selected, or a spotlight layout (focused card forward and enlarged,
 * the rest pushed aside and dimmed) once one is clicked. */
function getHeroCardLayout(index: number, active: number | null) {
  const base = heroCardFanLayout[index];
  if (active === null) {
    return { x: base.x, y: base.y, rotate: base.rotate, scale: base.scale, z: base.z, opacity: 1 };
  }
  if (index === active) {
    return { x: 0, y: -18, rotate: 0, scale: 1.32, z: 50, opacity: 1 };
  }
  const diff = index - active;
  const dir = diff < 0 ? -1 : 1;
  const dist = Math.abs(diff);
  return {
    x: dir * (140 + dist * 44),
    y: 44 + dist * 12,
    rotate: dir * (14 + dist * 5),
    scale: Math.max(0.52, 0.66 - dist * 0.05),
    z: 10 + (heroStackPhotos.length - dist),
    opacity: 0.5,
  };
}

interface HomeViewProps {
  courses: Course[];
  products: Product[];
  categories: CourseCategory[];
  initialWishlistedProductIds: string[];
}

export function HomeView({ courses, products, categories, initialWishlistedProductIds }: HomeViewProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [wishlisted, setWishlisted] = useState(new Set(initialWishlistedProductIds));

  useEffect(() => {
    if (!isAuthenticated) return;
    getCurrentUserWishlistedProductIds()
      .then((ids) => setWishlisted(new Set(ids)))
      .catch(() => {});
  }, [isAuthenticated]);

  const [activeHeroCard, setActiveHeroCard] = useState<number | null>(null);
  const activeHeroStory = activeHeroCard !== null ? heroStories[activeHeroCard] : null;
  const heroHasMounted = useRef(false);
  useEffect(() => {
    heroHasMounted.current = true;
  }, []);
  const toggleHeroCard = (index: number) => {
    setActiveHeroCard((prev) => (prev === index ? null : index));
  };

  const prefersReducedMotion = useReducedMotion();
  const [ambientBgIndex, setAmbientBgIndex] = useState(0);
  // setTimeout (not setInterval) so a manual jump via the progress bars
  // restarts the 6s countdown and the bar fill stays in sync.
  useEffect(() => {
    if (activeHeroCard !== null) return;
    const id = setTimeout(() => {
      setAmbientBgIndex((prev) => (prev + 1) % heroAmbientBackgrounds.length);
    }, HERO_SLIDE_MS);
    return () => clearTimeout(id);
  }, [activeHeroCard, ambientBgIndex]);

  // Pointer-driven 3D tilt for the photo stack.
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const stackRotateX = useSpring(useTransform(tiltY, [-0.5, 0.5], [9, -9]), { stiffness: 120, damping: 18 });
  const stackRotateY = useSpring(useTransform(tiltX, [-0.5, 0.5], [-12, 12]), { stiffness: 120, damping: 18 });
  const handleStackMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    tiltX.set((e.clientX - rect.left) / rect.width - 0.5);
    tiltY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const resetStackTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

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

  const handleAddCourseToCart = (course: Course) => {
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

  const handleToggleWishlist = async (product: Product) => {
    if (!isAuthenticated) {
      router.push('/auth/login?next=/');
      return;
    }
    const wasWishlisted = wishlisted.has(product.id);
    setWishlisted((prev) => {
      const next = new Set(prev);
      if (wasWishlisted) next.delete(product.id);
      else next.add(product.id);
      return next;
    });
    try {
      const saved = await toggleWishlistItem('product', product.id);
      setWishlisted((prev) => {
        const next = new Set(prev);
        if (saved) next.add(product.id);
        else next.delete(product.id);
        return next;
      });
      toast.success(saved ? 'Ajoute a vos favoris' : 'Retire de vos favoris');
    } catch (err) {
      setWishlisted((prev) => {
        const next = new Set(prev);
        if (wasWishlisted) next.add(product.id);
        else next.delete(product.id);
        return next;
      });
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue.');
    }
  };

  return (
    <div className="home-reference bg-white text-gray-900">
      <section className="relative isolate overflow-hidden bg-black pt-[58px]">
        <div className="absolute inset-0">
          <AnimatePresence initial={false}>
            {activeHeroCard === null ? (
              <motion.div
                key={`hero-ambient-${heroAmbientBackgrounds[ambientBgIndex]}`}
                aria-hidden="true"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: prefersReducedMotion ? 1 : 1.12 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: (HERO_SLIDE_MS + 1200) / 1000, ease: 'linear' }}
                >
                  <Image
                    src={heroAmbientBackgrounds[ambientBgIndex]}
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover object-center"
                    priority={ambientBgIndex === 0}
                  />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key={`hero-bg-${heroStackPhotos[activeHeroCard].src}`}
                aria-hidden="true"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={heroStackPhotos[activeHeroCard].src}
                  alt=""
                  fill
                  sizes="100vw"
                  className="scale-110 object-cover object-center blur-md"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-black"
            initial={false}
            animate={{ opacity: activeHeroCard === null ? 0.08 : 0.22 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
          {heroStories.map((story, i) => (
            <motion.div
              key={story.tag}
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: `radial-gradient(circle at 76% 42%, ${story.accent}66, transparent 60%)` }}
              initial={false}
              animate={{ opacity: activeHeroCard === i ? 1 : 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-58px)] max-w-[1520px] flex-col px-6 py-12 sm:px-10 lg:px-14">
          <div className="grid flex-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.75 } } }}
              className="relative max-w-[660px]"
            >
              <div className="grid">
                <AnimatePresence initial={false}>
                  {activeHeroStory ? (
                    <motion.div
                      key={`hero-story-${activeHeroCard}`}
                      className="[grid-area:1/1]"
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: -16, filter: 'blur(6px)', transition: { duration: 0.3 } }}
                      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
                    >
                      <motion.span
                        variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }}
                        className="inline-flex items-center gap-2 bg-white px-3 py-1.5 text-[12px] font-semibold leading-none text-black"
                      >
                        <Handshake className="h-3.5 w-3.5 text-[#ff7a3d]" />
                        {activeHeroStory.tag}
                      </motion.span>
                      <MaskedHeadline
                        text={activeHeroStory.headline}
                        className="relative mt-6 max-w-[640px] font-display text-[40px] font-medium leading-[0.98] text-white sm:text-[56px] lg:text-[66px]"
                      />
                      <motion.p variants={itemReveal} className="relative mt-6 max-w-[460px] text-[15px] font-medium leading-[1.55] text-white/80">
                        {activeHeroStory.text}
                      </motion.p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="hero-default"
                      className="[grid-area:1/1]"
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: -16, filter: 'blur(6px)', transition: { duration: 0.3 } }}
                      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
                    >
                      <motion.div variants={itemReveal} className="relative flex items-center gap-3 pt-4">
                        <motion.span
                          aria-hidden="true"
                          className="absolute inset-x-0 top-0 h-px origin-left bg-white/40"
                          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } } }}
                        />
                        <div className="flex items-center gap-0.5 text-[#ff7a3d]">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                        <span className="text-[13px] font-medium text-white/85"><strong className="font-black text-white">4,9</strong> / 500+ producteurs satisfaits</span>
                      </motion.div>

                      <MaskedHeadline
                        text={heroHeadline}
                        highlight={heroHighlightWords}
                        className="relative mt-6 max-w-[640px] font-display text-[40px] font-medium leading-[0.98] text-white sm:text-[56px] lg:text-[66px]"
                      />

                      <motion.p variants={itemReveal} className="relative mt-6 max-w-[460px] text-[15px] font-medium leading-[1.55] text-white/80">
                        Formez-vous, achetez les bons intrants et faites accompagner vos projets par des experts qui comprennent les realites agricoles africaines.
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.div variants={itemReveal} className="relative mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/courses"
                  className="group relative inline-flex h-[46px] min-w-[160px] items-center justify-center gap-2 overflow-hidden bg-[#ff7a3d] px-7 text-[13px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(255,122,61,0.35)]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/35 transition-[left] duration-700 ease-out group-hover:left-[120%]"
                  />
                  <span className="relative">Commencer</span>
                  <ArrowUpRight className="relative h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex h-[46px] items-center justify-center border border-white/40 px-7 text-[13px] font-semibold text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-black"
                >
                  Explorer les services
                </Link>
              </motion.div>

              <motion.div
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 1 } } }}
                initial="hidden"
                animate="visible"
                className="mt-10 grid max-w-[560px] grid-cols-3 gap-px overflow-hidden bg-white/15 ring-1 ring-white/15"
              >
                {heroStats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    variants={{
                      hidden: { opacity: 0, y: '100%' },
                      visible: { opacity: 1, y: '0%', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
                    }}
                    className={cn(
                      'relative overflow-hidden px-4 py-5 sm:px-6',
                      i === 0 ? 'bg-[#ff7a3d]' : 'bg-black/35 backdrop-blur-md'
                    )}
                  >
                    {i === 0 && (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-16 -right-10 h-[120px] w-[120px] rounded-full border border-white/35 opacity-70"
                        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '10px 10px' }}
                      />
                    )}
                    <strong className="relative block text-[26px] font-black leading-none text-white sm:text-[32px]">
                      <CountUp value={stat.count} suffix={stat.suffix} />
                    </strong>
                    <span className="relative mt-2 block text-[12px] font-medium leading-tight text-white/85">{stat.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <div
              className="relative hidden h-full min-h-[420px] items-center [perspective:1400px] lg:flex"
              onMouseMove={handleStackMove}
              onMouseLeave={resetStackTilt}
            >
              <motion.div
                className="relative mx-auto h-[380px] w-full max-w-md [transform-style:preserve-3d]"
                style={{ rotateX: stackRotateX, rotateY: stackRotateY }}
              >
              <div className={cn('relative h-full w-full', !prefersReducedMotion && 'animate-float')}>
                {heroStackPhotos.map((photo, i) => {
                  const layout = getHeroCardLayout(i, activeHeroCard);
                  const isActive = activeHeroCard === i;
                  const focusTransition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const };
                  const entranceTransition = { type: 'spring' as const, stiffness: 150, damping: 16, mass: 0.8, delay: 0.2 + i * 0.06 };
                  return (
                    <motion.div
                      key={photo.src}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isActive}
                      aria-label={`Mettre en avant : ${heroStories[i].tag}`}
                      onClick={() => toggleHeroCard(i)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleHeroCard(i);
                        }
                      }}
                      initial={{ opacity: 0, x: 0, y: 90, rotate: 0, scale: 0.7 }}
                      animate={{ opacity: layout.opacity, x: layout.x, y: layout.y, rotate: layout.rotate, scale: layout.scale }}
                      transition={heroHasMounted.current ? focusTransition : entranceTransition}
                      whileHover={
                        isActive
                          ? undefined
                          : {
                              y: layout.y - 20,
                              scale: layout.scale * 1.08,
                              rotate: layout.rotate * 0.3,
                              zIndex: 40,
                              transition: { type: 'spring', stiffness: 300, damping: 18 },
                            }
                      }
                      className="absolute left-1/2 top-1/2 h-56 w-44 -ml-[88px] -mt-[112px] cursor-pointer outline-none"
                      style={{ zIndex: layout.z }}
                    >
                      <div
                        className={cn(
                          'h-full w-full overflow-hidden border-[3px] shadow-[0_24px_60px_rgba(0,0,0,0.35)] transition-colors duration-500',
                          isActive ? 'border-[#ff7a3d]' : 'border-white'
                        )}
                      >
                        <Image src={photo.src} alt={photo.alt} fill sizes="220px" className="object-cover" priority={i === 2} />
                      </div>
                      {isActive && !prefersReducedMotion && (
                        <motion.span
                          aria-hidden="true"
                          className="pointer-events-none absolute -inset-1 border-2 border-[#ff7a3d]"
                          initial={{ opacity: 0.8, scale: 1 }}
                          animate={{ opacity: 0, scale: 1.12 }}
                          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                        />
                      )}
                    </motion.div>
                  );
                })}

                <motion.div
                  initial={{ opacity: 0, y: -12, scale: 0.7 }}
                  animate={{ opacity: activeHeroCard === null ? 1 : 0, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: heroHasMounted.current ? 0 : 0.55 }}
                  className="absolute -left-2 top-2 z-40 flex items-center gap-1.5 bg-white px-3.5 py-2 text-[12px] font-semibold text-black shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
                >
                  <Users className="h-3.5 w-3.5 text-[#ff7a3d]" />
                  2K+ apprenants
                  {!prefersReducedMotion && <span aria-hidden="true" className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-ping rounded-full bg-[#ff7a3d]" />}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -12, scale: 0.7 }}
                  animate={{ opacity: activeHeroCard === null ? 1 : 0, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: heroHasMounted.current ? 0 : 0.65 }}
                  className="absolute -right-2 top-12 z-40 flex items-center gap-1.5 bg-[#ff7a3d] px-3.5 py-2 text-[12px] font-semibold text-white shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  500+ projets suivis
                </motion.div>
              </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Slideshow progress: one bar per ambient photo, click to jump */}
        <AnimatePresence>
          {activeHeroCard === null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: heroHasMounted.current ? 0 : 1.3 }}
              className="absolute bottom-8 right-6 z-20 flex items-center gap-2 sm:right-10 lg:right-14"
            >
              {heroAmbientBackgrounds.map((bg, i) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => setAmbientBgIndex(i)}
                  aria-label={`Afficher l image ${i + 1}`}
                  aria-current={i === ambientBgIndex}
                  className="group flex h-6 items-center"
                >
                  <span className="relative block h-[3px] w-8 overflow-hidden bg-white/25 transition-colors group-hover:bg-white/45 sm:w-10">
                    {i < ambientBgIndex && <span className="absolute inset-0 bg-white" />}
                    {i === ambientBgIndex && (
                      <motion.span
                        key={`bar-${ambientBgIndex}`}
                        className="absolute inset-y-0 left-0 bg-[#ff7a3d]"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: HERO_SLIDE_MS / 1000, ease: 'linear' }}
                      />
                    )}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll cue */}
        <motion.button
          type="button"
          onClick={() => window.scrollBy({ top: window.innerHeight - 60, behavior: 'smooth' })}
          aria-label="Defiler vers la suite"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-1 text-white/60 transition-colors hover:text-white lg:flex"
        >
          <span className="text-[11px] font-medium">Defiler</span>
          <motion.span
            animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </motion.button>
      </section>

      <motion.section
        className="relative overflow-hidden bg-[#f6f5f2]"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={sectionReveal}
      >
        <div className="relative mx-auto max-w-[1520px] px-6 pb-0 pt-14 sm:px-10 lg:min-h-[760px] lg:px-14 lg:pb-0">
          <motion.div variants={staggerReveal} className="relative z-20 max-w-[650px]">
            <motion.h2
              custom={0}
              variants={springUp}
              className="font-display text-[38px] font-medium leading-[0.95] text-black sm:text-[52px] lg:text-[64px]"
            >
              Cultivez Votre
              <span className="block">projet</span>
              <span className="block">Ici</span>
            </motion.h2>
            <motion.p
              custom={1}
              variants={springUp}
              className="mt-8 max-w-[420px] text-[15px] font-medium leading-[1.55] text-black"
            >
              Plus de 360 heures de formation et des dizaines d intrants selectionnes, avec un accompagnement terrain a chaque etape de votre projet agricole.
            </motion.p>
            <motion.div custom={2} variants={springUp} className="mt-7">
              <Link
                href="/courses"
                className="inline-flex h-[42px] min-w-[154px] items-center justify-center bg-black px-7 text-[13px] font-semibold text-white transition-colors hover:bg-cipresa-950"
              >
                Commencer
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={springUp}
            className="relative z-10 mt-9 aspect-[1448/1086] w-full overflow-hidden lg:absolute lg:bottom-[190px] lg:right-14 lg:mt-0 lg:w-[52%] lg:max-w-[700px] xl:right-[8%]"
          >
            <Image
              src="/images/academy.png"
              alt="Formation agricole sur le terrain"
              fill
              sizes="(min-width: 1024px) min(52vw, 700px), 92vw"
              className="object-contain"
              priority={false}
            />
          </motion.div>

          <motion.div
            variants={staggerReveal}
            className="relative z-30 grid overflow-hidden bg-white shadow-[0_-18px_50px_rgba(0,0,0,0.05)] lg:absolute lg:bottom-0 lg:left-14 lg:right-14 lg:grid-cols-[1.05fr_0.95fr_0.86fr]"
          >
            <motion.div variants={springUp} className="relative min-h-[170px] overflow-hidden bg-[#ff7a3d] px-8 py-8 text-white lg:min-h-[200px]">
              <div
                aria-hidden="true"
                className="absolute -bottom-24 right-6 h-[230px] w-[230px] rounded-full border border-white/35 opacity-70"
                style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
              />
              <p className="relative text-[42px] font-black leading-none">360+</p>
              <p className="relative mt-1 max-w-[185px] text-[14px] font-medium leading-tight">Heures de formation agricole</p>
              <Leaf className="absolute bottom-9 left-[45%] h-5 w-5 fill-white text-white" />
              <Leaf className="absolute right-[26%] top-14 h-5 w-5 fill-white text-white" />
              <Leaf className="absolute bottom-12 right-[12%] h-4 w-4 fill-white text-white" />
            </motion.div>

            <motion.div variants={springUp} className="px-7 py-7 lg:px-8">
              <div className="flex items-start justify-between gap-6">
                <p className="text-[18px] font-semibold leading-none text-black">Accompagnement terrain</p>
                <div className="flex items-center gap-2">
                  <p className="text-[34px] font-black leading-none text-black">4.9</p>
                  <Star className="mt-0.5 h-4 w-4 fill-[#ff7a3d] text-[#ff7a3d]" />
                </div>
              </div>
              <div className="my-8 h-px bg-gray-200" />
              <div className="flex items-end justify-between gap-5">
                <p className="max-w-[235px] text-[12px] font-medium leading-tight text-black">Avis verifies des porteurs de projets et apprenants</p>
                <Link href="/courses" aria-label="Voir les formations" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff7a3d] text-white transition-transform hover:-translate-y-0.5">
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div variants={springUp} className="relative overflow-hidden px-7 py-7 lg:px-8">
              <div aria-hidden="true" className="absolute -right-6 top-3 h-[152px] w-[152px] opacity-10">
                <div className="absolute right-0 top-0 h-12 w-28 skew-x-[-45deg] bg-black" />
                <div className="absolute right-10 top-14 h-12 w-28 skew-x-[-45deg] bg-black" />
                <div className="absolute right-20 top-28 h-12 w-28 skew-x-[-45deg] bg-black" />
              </div>
              <p className="relative text-[34px] font-black leading-none text-black">50K+</p>
              <p className="relative mt-[70px] max-w-[160px] text-[12px] font-medium leading-tight text-black">Intrants selectionnes pour lancer et soutenir votre projet</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="relative overflow-hidden bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={servicesSectionReveal}
      >
        <div className="relative mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
          <motion.div variants={staggerReveal} className="grid gap-8 border-t border-black pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <motion.h2
              custom={0}
              variants={springUp}
              className="font-display text-[32px] font-medium leading-[0.95] text-black sm:text-[44px] lg:text-[54px]"
            >
              Nos services
              <span className="block">pour avancer</span>
            </motion.h2>
            <motion.div custom={1} variants={springUp} className="max-w-[420px]">
              <p className="text-[15px] font-medium leading-[1.55] text-black">
                Choisissez une action, comprenez la valeur, puis avancez vers le bon espace agricole avec CIPRESA.
              </p>
              <Link
                href="/services"
                className="group mt-7 inline-flex h-[42px] min-w-[154px] items-center justify-center gap-2 bg-black px-7 text-[13px] font-semibold text-white transition-colors hover:bg-cipresa-950"
              >
                Voir les services
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={staggerReveal}
            className="mt-14 grid gap-px overflow-hidden bg-gray-200 shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200 sm:grid-cols-2 lg:grid-cols-4"
          >
            {services.map((service, i) => (
              <ServiceCard key={service.title} service={service} index={i} />
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section className="relative overflow-hidden bg-[#f6f5f2]" initial="hidden" whileInView="visible" viewport={viewport} variants={sectionReveal}>
        <div className="relative mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
          <motion.div variants={staggerReveal} className="grid gap-8 border-t border-black pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <motion.h2
              custom={0}
              variants={springUp}
              className="font-display text-[32px] font-medium leading-[0.95] text-black sm:text-[44px] lg:text-[54px]"
            >
              Trouvez vite
              <span className="block">le bon sujet agricole</span>
            </motion.h2>
            <motion.div custom={1} variants={springUp} className="max-w-[420px]">
              <p className="text-[15px] font-medium leading-[1.55] text-black">
                Des entrees visuelles pour orienter les visiteurs vers les formations les plus pertinentes.
              </p>
              <Link
                href="/courses"
                className="group mt-7 inline-flex h-[42px] min-w-[154px] items-center justify-center gap-2 bg-black px-7 text-[13px] font-semibold text-white transition-colors hover:bg-cipresa-950"
              >
                Toutes les formations
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div className="mt-14 grid auto-rows-[260px] gap-3 sm:grid-cols-2 lg:grid-cols-6" variants={staggerReveal}>
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                variants={itemReveal}
                className={cn(index === 0 ? 'sm:col-span-2 lg:row-span-2' : '', 'lg:col-span-2')}
              >
                <Link
                  href={`/courses?category=${category.slug}`}
                  className="group relative block h-full overflow-hidden bg-black shadow-[0_18px_50px_rgba(0,0,0,0.05)]"
                >
                  <CoverImage
                    src={category.image}
                    alt={category.name}
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="transition duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 transition-opacity duration-500 group-hover:opacity-90" />

                  <div className="absolute inset-0 flex flex-col p-7 text-white lg:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-[34px] font-black leading-none">{String(index + 1).padStart(2, '0')}</p>
                      <span className="bg-white px-3 py-1.5 text-[12px] font-semibold leading-none text-black">
                        {category.count} cours
                      </span>
                    </div>

                    <div className="mt-auto">
                      <strong
                        className={cn(
                          'block max-w-[320px] font-medium leading-tight',
                          index === 0 ? 'font-display text-[28px] sm:text-[36px] lg:text-[44px] lg:leading-[0.98]' : 'text-[18px] font-semibold'
                        )}
                      >
                        {category.name}
                      </strong>
                      <div className="my-5 h-px bg-white/30" />
                      <div className="flex items-center justify-between gap-5">
                        <p className="text-[12px] font-medium leading-tight text-white/80">Explorer les formations</p>
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff7a3d] text-white transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-[#ff7a3d]">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[#ff7a3d] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                </Link>
              </motion.div>
            ))}
            {categories.length === 0 && (
              <p className="col-span-full py-12 text-center text-[15px] font-medium text-black/60">Categories bientot disponibles.</p>
            )}
          </motion.div>
        </div>
      </motion.section>

      <motion.section className="relative overflow-hidden bg-white" initial="hidden" whileInView="visible" viewport={viewport} variants={sectionReveal}>
        <div className="relative mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
          <motion.div variants={staggerReveal} className="grid gap-8 border-t border-black pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <motion.h2
              custom={0}
              variants={springUp}
              className="font-display text-[32px] font-medium leading-[0.95] text-black sm:text-[44px] lg:text-[54px]"
            >
              Des cours populaires
              <span className="block">qui menent a l action</span>
            </motion.h2>
            <motion.div custom={1} variants={springUp} className="max-w-[420px]">
              <p className="text-[15px] font-medium leading-[1.55] text-black">
                Chaque carte donne rapidement le niveau de confiance: duree, lecons, avis et prix.
              </p>
              <Link
                href="/courses"
                className="group mt-7 inline-flex h-[42px] min-w-[154px] items-center justify-center gap-2 bg-black px-7 text-[13px] font-semibold text-white transition-colors hover:bg-cipresa-950"
              >
                Voir tous les cours
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" variants={staggerReveal}>
            {courses.map((course, index) => {
              const isFree = course.price === 0;
              const courseHref = `/course/${course.slug}`;
              return (
                <motion.article
                  key={course.id}
                  variants={itemReveal}
                  className="group relative flex h-full flex-col bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200 transition-shadow duration-500 hover:shadow-[0_24px_60px_rgba(0,0,0,0.1)]"
                >
                  <Link href={courseHref} className="relative block h-56 overflow-hidden bg-black" aria-label={course.title}>
                    <CoverImage
                      src={course.thumbnail}
                      alt={course.title}
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="transition duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    <span className="absolute left-5 top-5 bg-white px-3 py-1.5 text-[12px] font-semibold leading-none text-black">
                      {courseBadges[index] ?? 'Populaire'}
                    </span>
                    <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[#ff7a3d] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                  </Link>

                  <div className="flex flex-1 flex-col px-6 pb-6 pt-6">
                    <Link href={courseHref}>
                      <h3 className="min-h-[44px] text-[18px] font-semibold leading-tight text-black transition-colors duration-300 hover:text-[#ff7a3d]">
                        {course.title}
                      </h3>
                    </Link>
                    <p className="mt-3 flex items-center gap-2 text-[12px] font-medium text-black/70">
                      <ShieldCheck className="h-4 w-4 stroke-[1.7] text-black" />
                      {course.instructor.fullName}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-medium text-black">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-[#ff7a3d] text-[#ff7a3d]" />
                        ({course.totalReviews})
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Timer className="h-3.5 w-3.5 stroke-[1.7]" />
                        {course.duration}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <BookOpenText className="h-3.5 w-3.5 stroke-[1.7]" />
                        {course.totalLessons} lecons
                      </span>
                    </div>

                    <div className="my-6 h-px bg-gray-200" />

                    <div className="mt-auto flex items-center justify-between gap-4">
                      <p className="text-[24px] font-black leading-none text-black">
                        {isFree ? 'Gratuit' : formatCurrency(course.salePrice ?? course.price, course.currency)}
                      </p>
                      {isFree ? (
                        <Link
                          href={courseHref}
                          className="inline-flex h-[42px] shrink-0 items-center justify-center gap-2 bg-black px-5 text-[13px] font-semibold text-white transition-colors duration-300 hover:bg-[#ff7a3d]"
                        >
                          Commencer
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddCourseToCart(course)}
                          className="inline-flex h-[42px] shrink-0 items-center justify-center gap-2 bg-black px-5 text-[13px] font-semibold text-white transition-colors duration-300 hover:bg-[#ff7a3d] active:scale-[0.97]"
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
            {courses.length === 0 && (
              <p className="col-span-full py-12 text-center text-[15px] font-medium text-black/60">Formations bientot disponibles.</p>
            )}
          </motion.div>
        </div>
      </motion.section>

      <motion.section className="relative overflow-hidden bg-[#f6f5f2]" initial="hidden" whileInView="visible" viewport={viewport} variants={sectionReveal}>
        <div className="relative mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
          <motion.div variants={staggerReveal} className="grid gap-8 border-t border-black pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <motion.h2
              custom={0}
              variants={springUp}
              className="font-display text-[28px] font-medium leading-[0.95] text-black sm:text-[38px] lg:text-[46px]"
            >
              Un parcours lisible
              <span className="block">de la decision au rendement</span>
            </motion.h2>
            <motion.div custom={1} variants={springUp} className="max-w-[420px]">
              <p className="text-[15px] font-medium leading-[1.55] text-black">
                Les visiteurs comprennent immediatement comment CIPRESA travaille: diagnostiquer, planifier, executer puis mesurer.
              </p>
              <motion.ul variants={staggerReveal} className="mt-7 grid grid-cols-2 gap-px overflow-hidden bg-gray-200 ring-1 ring-gray-200">
                {methodPillars.map(({ label, icon: Icon }) => (
                  <motion.li
                    key={label}
                    variants={fadeUp}
                    className="group flex items-center gap-3 bg-white px-4 py-3 transition-colors duration-500 hover:bg-black"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ff7a3d]/10 text-[#ff7a3d] transition-all duration-500 group-hover:rotate-[-8deg] group-hover:bg-[#ff7a3d] group-hover:text-white">
                      <Icon className="h-4 w-4 stroke-[1.8]" />
                    </span>
                    <span className="text-[13px] font-semibold leading-none text-black transition-colors duration-500 group-hover:text-white">{label}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>

          <div className="relative mt-14">
            {/* Timeline rail that draws itself across the four steps */}
            <div aria-hidden="true" className="relative mb-6 hidden h-3 lg:block">
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-black/10" />
              <motion.div
                className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#ff7a3d]"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={viewport}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: 'left' }}
              />
              <div className="absolute inset-0 grid grid-cols-4">
                {process.map(([number], i) => (
                  <motion.span
                    key={number}
                    className="ml-8 h-3 w-3 rounded-full bg-[#ff7a3d] ring-4 ring-[#f6f5f2]"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={viewport}
                    transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.25 + i * 0.3 }}
                  />
                ))}
              </div>
            </div>

            <motion.div
              variants={staggerReveal}
              className="grid gap-px overflow-hidden bg-gray-200 shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200 sm:grid-cols-2 lg:grid-cols-4"
            >
              {process.map(([number, title, text]) => (
                <motion.div
                  key={number}
                  variants={serviceCardReveal}
                  className="group relative flex min-h-[250px] flex-col overflow-hidden bg-white px-7 py-8 lg:px-8"
                >
                  <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#ff7a3d] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                  <p className="text-[34px] font-black leading-none text-black transition-colors duration-500 group-hover:text-[#ff7a3d]">{number}</p>
                  <div className="mt-auto pt-14">
                    <h3 className="text-[18px] font-semibold leading-tight text-black">{title}</h3>
                    <div className="my-5 h-px bg-gray-200" />
                    <p className="max-w-[260px] text-[12px] font-medium leading-tight text-black/80">{text}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section className="relative overflow-hidden bg-white" initial="hidden" whileInView="visible" viewport={viewport} variants={sectionReveal}>
        <div className="relative mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
          <motion.div variants={staggerReveal} className="grid gap-8 border-t border-black pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <motion.h2
              custom={0}
              variants={springUp}
              className="font-display text-[28px] font-medium leading-[0.95] text-black sm:text-[38px] lg:text-[46px]"
            >
              Des produits utiles
              <span className="block">faciles a ajouter au panier</span>
            </motion.h2>
            <motion.div custom={1} variants={springUp} className="max-w-[420px]">
              <p className="text-[15px] font-medium leading-[1.55] text-black">
                Les interactions principales restent directes: consulter, aimer, acheter.
              </p>
              <Link
                href="/marketplace"
                className="group mt-7 inline-flex h-[42px] min-w-[154px] items-center justify-center gap-2 bg-black px-7 text-[13px] font-semibold text-white transition-colors hover:bg-cipresa-950"
              >
                Voir la boutique
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" variants={staggerReveal}>
            {products.map((product, index) => {
              const isWishlisted = wishlisted.has(product.id);
              const productHref = `/product/${product.slug}`;
              return (
                <motion.article
                  key={product.id}
                  variants={itemReveal}
                  className="group relative flex h-full flex-col bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200 transition-shadow duration-500 hover:shadow-[0_24px_60px_rgba(0,0,0,0.1)]"
                >
                  <div className="relative h-56 overflow-hidden bg-[#f6f5f2]">
                    <Link href={productHref} className="absolute inset-0 block" aria-label={product.name}>
                      <CoverImage
                        src={product.images[0] ?? ''}
                        alt={product.name}
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="transition duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                    </Link>
                    <span className="pointer-events-none absolute left-5 top-5 bg-white px-3 py-1.5 text-[12px] font-semibold leading-none text-black">
                      {productBadges[index] ?? 'Populaire'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleWishlist(product)}
                      aria-label={isWishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      aria-pressed={isWishlisted}
                      className={cn(
                        'absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 active:scale-90',
                        isWishlisted ? 'bg-[#ff7a3d] text-white' : 'bg-white text-black hover:bg-[#ff7a3d] hover:text-white'
                      )}
                    >
                      <Heart className={cn('h-4 w-4', isWishlisted && 'fill-current')} />
                    </button>
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[#ff7a3d] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                  </div>

                  <div className="flex flex-1 flex-col px-6 pb-6 pt-6">
                    <Link href={productHref}>
                      <h3 className="min-h-[44px] text-[18px] font-semibold leading-tight text-black transition-colors duration-300 hover:text-[#ff7a3d]">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="mt-4 flex items-center gap-0.5 text-[12px] font-medium text-black">
                      {Array.from({ length: 5 }).map((_, star) => (
                        <Star key={star} className="h-3.5 w-3.5 fill-[#ff7a3d] text-[#ff7a3d]" />
                      ))}
                      <span className="ml-1.5">({product.totalReviews})</span>
                    </div>

                    <div className="my-6 h-px bg-gray-200" />

                    <div className="mt-auto flex items-end justify-between gap-4">
                      <p className="leading-none text-black">
                        <span className="block text-[24px] font-black">{formatCurrency(product.salePrice ?? product.price, product.currency)}</span>
                        <span className="mt-1.5 block text-[12px] font-medium text-black/60">/ {product.unit}</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="inline-flex h-[42px] shrink-0 items-center justify-center gap-2 bg-black px-5 text-[13px] font-semibold text-white transition-colors duration-300 hover:bg-[#ff7a3d] active:scale-[0.97]"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Ajouter
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
            {products.length === 0 && (
              <p className="col-span-full py-12 text-center text-[15px] font-medium text-black/60">Produits bientot disponibles.</p>
            )}
          </motion.div>
        </div>
      </motion.section>

      <motion.section className="relative overflow-hidden bg-[#f6f5f2]" initial="hidden" whileInView="visible" viewport={viewport} variants={sectionReveal}>
        {/* CIPRESA logo as a large, faint watermark behind the section */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -right-[12%] my-auto h-[520px] w-[780px] select-none opacity-[0.06] grayscale sm:h-[640px] sm:w-[960px] lg:-right-[6%]"
          initial={{ scale: 0.94, rotate: -4 }}
          whileInView={{ scale: 1, rotate: -4 }}
          viewport={viewport}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image src="/images/logo.png" alt="" fill sizes="960px" className="object-contain" />
        </motion.div>

        <div className="relative mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
          <motion.div variants={staggerReveal} className="grid gap-8 border-t border-black pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <motion.h2
              custom={0}
              variants={springUp}
              className="font-display text-[24px] font-medium leading-[0.98] text-black sm:text-[32px] lg:text-[38px]"
            >
              CIPRESA, une revolution
              <span className="block">dans l&apos;accompagnement agricole africain</span>
            </motion.h2>
            <motion.p custom={1} variants={springUp} className="max-w-[420px] text-[15px] font-medium leading-[1.55] text-black">
              Pourquoi nous choisir : une equipe terrain, des methodes modernes et un suivi qui va jusqu&apos;au marche.
            </motion.p>
          </motion.div>

          <div className="mt-14 grid gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
            <motion.div variants={staggerReveal} className="relative flex flex-col">
              <motion.div variants={springUp} className="relative min-h-[320px] flex-1 overflow-hidden bg-black sm:min-h-[380px]">
                <Image
                  src="/images/hero/agriculture-hero.jpg"
                  alt="Agriculteurs accompagnes sur le terrain"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <p className="absolute bottom-6 left-7 max-w-[240px] text-[12px] font-medium leading-tight text-white">
                  Agriculteurs accompagnes sur le terrain
                </p>
              </motion.div>

              <motion.div variants={springUp} className="grid grid-cols-2 bg-white shadow-[0_-18px_50px_rgba(0,0,0,0.05)]">
                <div className="relative overflow-hidden bg-[#ff7a3d] px-7 py-7 text-white">
                  <div
                    aria-hidden="true"
                    className="absolute -bottom-24 -right-10 h-[200px] w-[200px] rounded-full border border-white/35 opacity-70"
                    style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
                  />
                  <p className="relative text-[42px] font-black leading-none">
                    <CountUp value={92} suffix="%" />
                  </p>
                  <p className="relative mt-1 text-[14px] font-medium leading-tight">Taux de reussite</p>
                </div>
                <div className="px-7 py-7">
                  <div className="flex items-center gap-2">
                    <p className="text-[34px] font-black leading-none text-black">
                      <CountUp value={96} suffix="%" />
                    </p>
                    <Star className="h-4 w-4 fill-[#ff7a3d] text-[#ff7a3d]" />
                  </div>
                  <div className="my-4 h-1 w-full bg-gray-200">
                    <motion.div
                      className="h-1 bg-[#ff7a3d]"
                      initial={{ width: 0 }}
                      whileInView={{ width: '96%' }}
                      viewport={viewport}
                      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                    />
                  </div>
                  <p className="text-[12px] font-medium leading-tight text-black">Satisfaction apprenants</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.ul
              variants={staggerReveal}
              className="grid gap-px self-start overflow-hidden bg-gray-200 shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200"
            >
              {benefits.map((benefit, i) => (
                <motion.li
                  key={benefit.title}
                  variants={serviceCardReveal}
                  className="group relative flex items-center gap-5 bg-white/90 px-6 py-6 backdrop-blur-sm transition-colors duration-500 hover:bg-white lg:px-8"
                >
                  <span className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-[#ff7a3d] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100" />
                  <span className="w-7 shrink-0 text-[13px] font-black text-black/30 transition-colors duration-500 group-hover:text-[#ff7a3d]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/15 text-black transition-all duration-500 group-hover:border-[#ff7a3d] group-hover:bg-[#ff7a3d] group-hover:text-white">
                    <benefit.icon className="h-5 w-5 stroke-[1.7]" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[18px] font-semibold leading-tight text-black">{benefit.title}</h3>
                    <p className="mt-1.5 max-w-[420px] text-[12px] font-medium leading-snug text-black/70">{benefit.text}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </motion.section>

      <motion.section className="relative overflow-hidden bg-white" initial="hidden" whileInView="visible" viewport={viewport} variants={sectionReveal}>
        <div className="relative mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
          <motion.div variants={staggerReveal} className="grid gap-8 border-t border-black pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <motion.h2
              custom={0}
              variants={springUp}
              className="font-display text-[24px] font-medium leading-[0.98] text-black sm:text-[32px] lg:text-[38px]"
            >
              Rejoignez{' '}
              <span className="font-black text-[#ff7a3d]">
                <CountUp value={20} suffix="K+" />
              </span>{' '}
              apprenants
              <span className="block">et une communaute d&apos;acteurs agricoles</span>
            </motion.h2>
            <motion.div custom={1} variants={springUp}>
              <Link
                href="/auth/register"
                className="group inline-flex h-[42px] min-w-[154px] items-center justify-center gap-2 bg-black px-7 text-[13px] font-semibold text-white transition-colors hover:bg-cipresa-950"
              >
                Rejoindre la communaute
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.ul
            variants={staggerReveal}
            className="mt-14 grid grid-cols-2 gap-px overflow-hidden bg-gray-200 shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200 sm:grid-cols-3 lg:grid-cols-6"
          >
            {trustCategories.map((item) => (
              <motion.li
                key={item.label}
                variants={serviceCardReveal}
                className="group relative flex min-h-[170px] flex-col justify-between overflow-hidden bg-white px-6 py-7 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#ff7a3d]"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-20 -right-14 h-[160px] w-[160px] translate-y-8 rounded-full border border-white/35 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-70"
                  style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
                />
                <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-black/15 text-black transition-colors duration-500 group-hover:border-white/50 group-hover:text-white">
                  <item.icon className="h-5 w-5 stroke-[1.7]" />
                </span>
                <span className="relative mt-8 text-[14px] font-semibold leading-tight text-black transition-colors duration-500 group-hover:text-white">
                  {item.label}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </motion.section>

      <motion.section className="relative overflow-hidden bg-[#f6f5f2]" initial="hidden" whileInView="visible" viewport={viewport} variants={sectionReveal}>
        <div className="relative mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
          <motion.div variants={staggerReveal} className="grid gap-8 border-t border-black pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <motion.h2
              custom={0}
              variants={springUp}
              className="font-display text-[24px] font-medium leading-[0.98] text-black sm:text-[32px] lg:text-[38px]"
            >
              Des producteurs et entrepreneurs
              <span className="block">avancent avec CIPRESA</span>
            </motion.h2>
            <motion.div custom={1} variants={springUp} className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <p className="text-[34px] font-black leading-none text-black">4.9</p>
                <Star className="h-4 w-4 fill-[#ff7a3d] text-[#ff7a3d]" />
              </div>
              <p className="max-w-[190px] text-[12px] font-medium leading-tight text-black">Avis verifies des porteurs de projets et apprenants</p>
            </motion.div>
          </motion.div>

          <motion.div
            variants={staggerReveal}
            className="mt-14 grid gap-px overflow-hidden bg-gray-200 shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200 md:grid-cols-3"
          >
            {testimonials.map((item, i) => {
              const featured = i === 0;
              return (
                <motion.figure
                  key={item.name}
                  variants={serviceCardReveal}
                  className={cn(
                    'group relative flex min-h-[340px] flex-col overflow-hidden px-7 py-8 lg:px-8',
                    featured ? 'bg-[#ff7a3d] text-white' : 'bg-white text-black'
                  )}
                >
                  {featured ? (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-24 -right-12 h-[230px] w-[230px] rounded-full border border-white/35 opacity-70"
                      style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
                    />
                  ) : (
                    <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#ff7a3d] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                  )}

                  <div className="relative flex items-start justify-between gap-4">
                    <Quote
                      className={cn(
                        'h-9 w-9 transition-transform duration-500 group-hover:-rotate-6',
                        featured ? 'fill-white text-white' : 'fill-[#ff7a3d] text-[#ff7a3d]'
                      )}
                    />
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, star) => (
                        <Star key={star} className={cn('h-3.5 w-3.5', featured ? 'fill-white text-white' : 'fill-[#ff7a3d] text-[#ff7a3d]')} />
                      ))}
                    </div>
                  </div>

                  <blockquote className="relative mt-8 text-[17px] font-medium leading-[1.45]">{item.text}</blockquote>

                  <figcaption className="relative mt-auto pt-8">
                    <div className={cn('mb-6 h-px', featured ? 'bg-white/35' : 'bg-gray-200')} />
                    <div className="flex items-center gap-4">
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        width={48}
                        height={48}
                        className={cn('h-12 w-12 rounded-full object-cover ring-2', featured ? 'ring-white/60' : 'ring-[#f6f5f2]')}
                      />
                      <div>
                        <strong className="block text-[15px] font-semibold leading-tight">{item.name}</strong>
                        <span className={cn('mt-1 block text-[12px] font-medium leading-tight', featured ? 'text-white/85' : 'text-black/60')}>
                          {item.role}
                        </span>
                      </div>
                    </div>
                  </figcaption>
                </motion.figure>
              );
            })}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
