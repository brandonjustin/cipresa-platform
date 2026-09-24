'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Share2, ArrowLeft, Check, Minus, Plus, Truck, Shield, Phone, Star, Loader2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils/cn';
import { PageTransition } from '@/components/animations/motion-components';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useCartStore } from '@/lib/store/cart-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { submitReview } from '@/lib/actions/courses';
import { toggleWishlistItem } from '@/lib/actions/wishlist';
import type { Product, Review } from '@/types';
import { BgImage } from '@/components/ui/bg-image';

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const guarantees = [
  { icon: Truck, title: 'Livraison partout au Cameroun', text: 'Sous 24h à 72h selon votre localisation' },
  { icon: Phone, title: 'Paiement Mobile Money', text: 'MTN Mobile Money & Orange Money acceptés' },
  { icon: Shield, title: 'Produits certifiés', text: 'Garantie de qualité et satisfaction' },
];

function Stars({ rating, size = 'h-4 w-4' }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn(size, i < Math.round(rating) ? 'fill-[#ff7a3d] text-[#ff7a3d]' : 'fill-black/10 text-black/10')} />
      ))}
    </div>
  );
}

interface ProductDetailViewProps {
  product: Product;
  reviews: Review[];
  initialIsWishlisted: boolean;
}

export function ProductDetailView({ product, reviews, initialIsWishlisted }: ProductDetailViewProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]?.id || null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?next=/product/${product.slug}`);
      return;
    }
    setIsTogglingWishlist(true);
    const previous = isWishlisted;
    setIsWishlisted(!previous);
    try {
      const saved = await toggleWishlistItem('product', product.id);
      setIsWishlisted(saved);
      toast.success(saved ? 'Ajouté à vos favoris' : 'Retiré de vos favoris');
    } catch (err) {
      setIsWishlisted(previous);
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const variant = selectedVariant ? product.variants.find((v) => v.id === selectedVariant) : null;
  // A selected variety has its own price; otherwise use the promo price when there is one.
  const currentPrice = variant?.price ?? product.salePrice ?? product.price;
  const currentStock = variant?.stock ?? product.stock;
  const inStock = currentStock > 0;
  const showStrikePrice = !variant && product.salePrice != null && product.salePrice < product.price;

  const handleAddToCart = () => {
    if (!inStock) return;
    addItem({ id: `product-${product.id}-${selectedVariant ?? 'base'}`, type: 'product', itemId: product.id, name: product.name, price: currentPrice, quantity, image: product.images[0] });
    setIsAdding(true);
    toast.success(`${quantity} × ${product.name} ajouté au panier`, { duration: 2500, position: 'top-center' });
    setTimeout(() => setIsAdding(false), 1400);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
      }
    }
    await navigator.clipboard.writeText(url);
    toast.success('Lien copié !');
  };

  const details = [
    { label: 'Stock', value: `${currentStock} ${product.unit}(s)` },
    { label: 'Variété', value: variant?.name || 'Standard' },
    { label: 'Note', value: `${product.rating}/5` },
    { label: 'Référence', value: `CIP-${product.id.slice(0, 8)}` },
  ];

  return (
    <PageTransition>
      <div className="pt-[60px]">
        {/* Product */}
        <section className="bg-[#f6f5f2]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }}
            className="mx-auto max-w-[1520px] px-6 pb-16 pt-8 sm:px-10 lg:px-14 lg:pb-20 lg:pt-10"
          >
            <motion.nav variants={reveal} aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-3">
              <Link href="/marketplace" className="group inline-flex items-center gap-2.5 text-[13px] font-semibold text-black">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 transition-all duration-300 group-hover:-translate-x-0.5 group-hover:border-black group-hover:bg-black group-hover:text-white">
                  <ArrowLeft className="h-3.5 w-3.5" />
                </span>
                Retour à la boutique
              </Link>
              <ChevronRight className="hidden h-3.5 w-3.5 text-black/30 sm:block" />
              <Link
                href={`/marketplace?category=${product.category.slug}`}
                className="hidden text-[12px] font-medium text-black/50 transition-colors hover:text-black sm:inline"
              >
                {product.category.name}
              </Link>
            </motion.nav>

            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
              {/* Gallery */}
              <motion.div variants={reveal} className="lg:sticky lg:top-24 lg:self-start">
                <div className="relative aspect-square overflow-hidden bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedImage}
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <BgImage
                        src={product.images[selectedImage] || product.images[0]}
                        alt={product.name}
                        className="h-full w-full"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        priority={selectedImage === 0}
                      />
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute left-5 top-5 flex flex-col items-start gap-1.5">
                    {product.featured && <span className="bg-white px-3 py-1.5 text-[12px] font-semibold leading-none text-black">Meilleure vente</span>}
                    {product.salePrice && <span className="bg-[#ff7a3d] px-3 py-1.5 text-[12px] font-semibold leading-none text-white">Promo</span>}
                  </div>
                </div>
                {product.images.length > 1 && (
                  <div className="mt-3 flex gap-3">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(idx)}
                        aria-label={`Voir l'image ${idx + 1}`}
                        aria-current={selectedImage === idx}
                        className={cn(
                          'relative h-20 w-20 overflow-hidden bg-white transition-all duration-300',
                          selectedImage === idx ? 'ring-2 ring-[#ff7a3d]' : 'opacity-70 ring-1 ring-black/10 hover:opacity-100'
                        )}
                      >
                        <BgImage src={img} className="h-full w-full" sizes="160px" />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Info */}
              <motion.div variants={reveal}>
                <span className="inline-flex items-center gap-2 bg-white px-3 py-1.5 text-[12px] font-semibold leading-none text-black ring-1 ring-black/10">
                  <ShoppingBag className="h-3.5 w-3.5 text-[#ff7a3d]" />
                  {product.category.name}
                </span>
                <h1 className="mt-5 font-display text-[32px] font-medium leading-[1] text-black sm:text-[42px] lg:text-[50px]">{product.name}</h1>
                <a href="#avis" className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-black/60 hover:text-black">
                  <Stars rating={product.rating} />
                  <span className="font-black text-black">{product.rating}</span>
                  <span>({product.totalReviews} avis)</span>
                </a>

                <p className="mt-6 max-w-[560px] text-[15px] font-medium leading-[1.6] text-black/75">{product.description}</p>

                {/* Price strip */}
                <div className="mt-8 grid overflow-hidden bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:grid-cols-[1.2fr_1fr]">
                  <div className="relative overflow-hidden bg-[#ff7a3d] px-7 py-6 text-white">
                    <div
                      aria-hidden="true"
                      className="absolute -bottom-20 -right-8 h-[170px] w-[170px] rounded-full border border-white/35 opacity-70"
                      style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
                    />
                    <p className="relative flex flex-wrap items-baseline gap-x-2">
                      <span className="text-[34px] font-black leading-none">{formatCurrency(currentPrice, product.currency)}</span>
                      <span className="text-[13px] font-medium text-white/85">/ {product.unit}</span>
                    </p>
                    {showStrikePrice && (
                      <p className="relative mt-1.5 text-[13px] font-medium text-white/80 line-through">{formatCurrency(product.price, product.currency)}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 border-t border-gray-200 px-7 py-6 sm:border-l sm:border-t-0">
                    <span className={cn('relative flex h-2.5 w-2.5 rounded-full', inStock ? 'bg-emerald-500' : 'bg-red-500')}>
                      {inStock && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-60" />}
                    </span>
                    <div>
                      <p className="text-[16px] font-bold leading-tight text-black">{inStock ? `${currentStock} en stock` : 'Rupture de stock'}</p>
                      <p className="mt-0.5 text-[12px] font-medium text-black/50">{inStock ? 'Prêt à être expédié' : 'Revenez bientôt'}</p>
                    </div>
                  </div>
                </div>

                {/* Varieties */}
                {product.variants.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-[12px] font-semibold text-black/50">Variétés</h3>
                    <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Variétés">
                      {product.variants.map((v) => {
                        const active = selectedVariant === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => {
                              setSelectedVariant(v.id);
                              setQuantity(1);
                            }}
                            className={cn(
                              'px-4 py-2.5 text-[13px] font-semibold transition-colors duration-300',
                              active ? 'bg-black text-white' : 'bg-white text-black ring-1 ring-black/10 hover:ring-black'
                            )}
                          >
                            {v.name}
                            <span className={cn('ml-2 font-medium', active ? 'text-white/60' : 'text-black/50')}>{formatCurrency(v.price, product.currency)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity + actions */}
                <div className="mt-8">
                  <h3 className="text-[12px] font-semibold text-black/50">Quantité</h3>
                  <div className="mt-3 flex flex-wrap items-stretch gap-3">
                    <div className="flex h-[52px] items-center bg-white ring-1 ring-black/10">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        aria-label="Réduire la quantité"
                        className="flex h-full w-12 items-center justify-center text-black transition-colors hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-30"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center text-[16px] font-bold text-black" aria-live="polite">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(Math.max(1, currentStock), q + 1))}
                        disabled={!inStock || quantity >= currentStock}
                        aria-label="Augmenter la quantité"
                        className="flex h-full w-12 items-center justify-center text-black transition-colors hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-30"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={handleAddToCart}
                      disabled={isAdding || !inStock}
                      className={cn(
                        'group relative flex h-[52px] min-w-[220px] flex-1 items-center justify-center overflow-hidden px-6 text-[14px] font-semibold text-white transition-colors duration-300 disabled:cursor-not-allowed',
                        !inStock ? 'bg-black/20 text-black/50' : isAdding ? 'bg-emerald-600' : 'bg-[#ff7a3d] hover:bg-black'
                      )}
                    >
                      <AnimatePresence mode="wait">
                        {isAdding ? (
                          <motion.span key="check" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="flex items-center gap-2">
                            <Check className="h-5 w-5" /> Ajouté au panier
                          </motion.span>
                        ) : (
                          <motion.span key="cart" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5" />
                            {inStock ? `Ajouter au panier · ${formatCurrency(currentPrice * quantity, product.currency)}` : 'Rupture de stock'}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    <button
                      type="button"
                      onClick={handleToggleWishlist}
                      disabled={isTogglingWishlist}
                      aria-pressed={isWishlisted}
                      aria-label={isWishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      className={cn(
                        'flex h-[52px] w-[52px] items-center justify-center transition-colors duration-300',
                        isWishlisted ? 'bg-[#ff7a3d] text-white' : 'bg-white text-black ring-1 ring-black/10 hover:bg-black hover:text-white'
                      )}
                    >
                      {isTogglingWishlist ? <Loader2 className="h-5 w-5 animate-spin" /> : <Heart className={cn('h-5 w-5', isWishlisted && 'fill-current')} />}
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      aria-label="Partager"
                      className="flex h-[52px] w-[52px] items-center justify-center bg-white text-black ring-1 ring-black/10 transition-colors duration-300 hover:bg-black hover:text-white"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Guarantees */}
                <ul className="mt-8 grid gap-px overflow-hidden bg-gray-200 ring-1 ring-gray-200 sm:grid-cols-3">
                  {guarantees.map((g) => (
                    <li key={g.title} className="bg-white px-5 py-5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff7a3d]/10 text-[#ff7a3d]">
                        <g.icon className="h-4 w-4" />
                      </span>
                      <p className="mt-4 text-[13px] font-semibold leading-tight text-black">{g.title}</p>
                      <p className="mt-1 text-[12px] font-medium leading-snug text-black/55">{g.text}</p>
                    </li>
                  ))}
                </ul>

                {/* Details */}
                <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-black pt-6 sm:grid-cols-4">
                  {details.map((item) => (
                    <div key={item.label}>
                      <dt className="text-[12px] font-medium text-black/50">{item.label}</dt>
                      <dd className="mt-1 text-[14px] font-semibold text-black">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Reviews */}
        <section id="avis" className="scroll-mt-20 bg-white">
          <div className="mx-auto max-w-[1520px] px-6 py-16 sm:px-10 lg:px-14 lg:py-20">
            <div className="grid gap-10 border-t border-black pt-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
              <div>
                <h2 className="font-display text-[28px] font-medium leading-[0.95] text-black sm:text-[38px] lg:text-[46px]">
                  Avis
                  <span className="block">clients</span>
                </h2>
                <div className="mt-8 flex items-center gap-4">
                  <p className="text-[48px] font-black leading-none text-black">{product.rating}</p>
                  <div>
                    <Stars rating={product.rating} size="h-5 w-5" />
                    <p className="mt-1.5 text-[12px] font-medium text-black/55">
                      {reviews.length} avis publié{reviews.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="mt-8">
                  <ProductReviewForm productId={product.id} productSlug={product.slug} isAuthenticated={isAuthenticated} />
                </div>
              </div>

              <div>
                {reviews.length === 0 ? (
                  <div className="flex h-full min-h-[220px] flex-col items-center justify-center bg-[#f6f5f2] px-6 py-12 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ff7a3d]/10 text-[#ff7a3d]">
                      <Star className="h-6 w-6" />
                    </span>
                    <p className="mt-4 text-[15px] font-semibold text-black">Aucun avis pour le moment.</p>
                    <p className="mt-1 text-[13px] font-medium text-black/55">Soyez le premier à partager votre expérience.</p>
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
                          <div className="mt-1.5">
                            <Stars rating={review.rating} size="h-3.5 w-3.5" />
                          </div>
                          <p className="mt-2 text-[14px] font-medium leading-[1.55] text-black/75">{review.comment}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

function ProductReviewForm({ productId, productSlug, isAuthenticated }: { productId: string; productSlug: string; isAuthenticated: boolean }) {
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="bg-[#f6f5f2] p-6">
        <p className="text-[14px] font-medium text-black">Vous avez utilisé ce produit ?</p>
        <p className="mt-1 text-[13px] font-medium text-black/55">Connectez-vous pour laisser un avis.</p>
        <Link
          href={`/auth/login?next=/product/${productSlug}`}
          className="mt-5 inline-flex h-[42px] items-center bg-black px-6 text-[13px] font-semibold text-white transition-colors hover:bg-[#ff7a3d]"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex items-start gap-3 bg-emerald-50 p-5">
        <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <p className="text-[14px] font-medium text-emerald-800">Merci pour votre avis ! Il sera visible après modération.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Écrivez quelques mots sur votre expérience.');
      return;
    }
    setIsSubmitting(true);
    try {
      await submitReview({ targetId: productId, targetType: 'product', rating, comment: comment.trim() });
      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const shown = hovered ?? rating;

  return (
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
      <label htmlFor="product-review" className="mt-5 block text-[12px] font-semibold text-black/50">
        Votre avis
      </label>
      <textarea
        id="product-review"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Partagez votre expérience avec ce produit..."
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
  );
}
