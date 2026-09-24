'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, ArrowUpRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/lib/utils/format';
import { useCartStore } from '@/lib/store/cart-store';
import { removeWishlistItem } from '@/lib/actions/wishlist';
import type { WishlistDetailRow } from '@/lib/data/wishlist';
import { BgImage } from '@/components/ui/bg-image';

interface WishlistItemDisplay {
  entryId: string;
  href: string;
  image: string;
  title: string;
  subtitle: string;
  price: number | null;
  currency: string;
  addToCart?: { id: string; type: 'course' | 'product'; itemId: string; name: string; price: number; quantity: number; image: string };
}

function toDisplay(row: WishlistDetailRow): WishlistItemDisplay {
  if (row.itemType === 'course') {
    const price = row.course.salePrice ?? row.course.price;
    return {
      entryId: row.id,
      href: `/course/${row.course.slug}`,
      image: row.course.thumbnail,
      title: row.course.title,
      subtitle: row.course.category.name,
      price,
      currency: row.course.currency,
      addToCart: price > 0
        ? { id: `course-${row.course.id}`, type: 'course', itemId: row.course.id, name: row.course.title, price, quantity: 1, image: row.course.thumbnail }
        : undefined,
    };
  }
  if (row.itemType === 'product') {
    const price = row.product.salePrice ?? row.product.price;
    return {
      entryId: row.id,
      href: `/product/${row.product.slug}`,
      image: row.product.images[0] ?? '',
      title: row.product.name,
      subtitle: row.product.category.name,
      price,
      currency: row.product.currency,
      addToCart: { id: `product-${row.product.id}-base`, type: 'product', itemId: row.product.id, name: row.product.name, price, quantity: 1, image: row.product.images[0] ?? '' },
    };
  }
  return {
    entryId: row.id,
    href: `/plant/${row.plant.slug}`,
    image: row.plant.images[0] ?? '',
    title: row.plant.commonName,
    subtitle: row.plant.category.name,
    price: row.plant.price > 0 ? row.plant.price : null,
    currency: row.plant.currency,
  };
}

export function WishlistView({ items }: { items: WishlistDetailRow[] }) {
  const [rows, setRows] = useState(items.map(toDisplay));
  const [isPending, startTransition] = useTransition();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  const handleRemove = (entryId: string) => {
    setRemovingId(entryId);
    startTransition(async () => {
      try {
        await removeWishlistItem(entryId);
        setRows((prev) => prev.filter((r) => r.entryId !== entryId));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Une erreur est survenue.');
      } finally {
        setRemovingId(null);
      }
    });
  };

  if (rows.length === 0) {
    return (
      <div className="relative overflow-hidden bg-white px-6 py-16 text-center shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:py-20">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-20 h-[220px] w-[220px] rounded-full border border-[#ff7a3d]/25 opacity-70"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,122,61,.35) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
        />
        <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ff7a3d] text-white">
          <Heart className="h-7 w-7" />
        </span>
        <h2 className="relative mt-6 font-display text-[24px] font-medium leading-tight text-black sm:text-[28px]">
          Votre liste de souhaits est vide.
        </h2>
        <p className="relative mx-auto mt-2 max-w-md text-[14px] font-medium leading-[1.6] text-black/60">
          Touchez le cœur sur une formation ou un produit pour le retrouver ici plus tard.
        </p>
        <div className="relative mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/courses"
            className="group inline-flex h-[44px] items-center gap-2 bg-black px-6 text-[13px] font-semibold text-white transition-colors hover:bg-[#ff7a3d]"
          >
            Explorer les formations
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </Link>
          <Link
            href="/marketplace"
            className="inline-flex h-[44px] items-center px-6 text-[13px] font-semibold text-black ring-1 ring-black/15 transition-colors hover:bg-[#f6f5f2]"
          >
            Voir la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-5 text-[13px] font-medium text-black/55">
        <span className="font-black text-black">{rows.length}</span> élément{rows.length > 1 ? 's' : ''} enregistré{rows.length > 1 ? 's' : ''}
      </p>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence initial={false}>
          {rows.map((item) => (
            <motion.article
              key={item.entryId}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="group relative flex flex-col bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200"
            >
              <Link href={item.href} className="relative block aspect-video overflow-hidden bg-[#f6f5f2]" aria-label={item.title}>
                {item.image && (
                  <BgImage src={item.image} className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                )}
                <span className="absolute left-4 top-4 bg-white px-2.5 py-1 text-[11px] font-semibold leading-none text-black">{item.subtitle}</span>
                <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[#ff7a3d] transition-transform duration-700 group-hover:scale-x-100" />
              </Link>
              <button
                type="button"
                onClick={() => handleRemove(item.entryId)}
                disabled={isPending && removingId === item.entryId}
                aria-label={`Retirer ${item.title} de la liste de souhaits`}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#ff7a3d] text-white shadow transition-colors hover:bg-black disabled:opacity-60"
              >
                {isPending && removingId === item.entryId ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4 fill-current" />}
              </button>

              <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
                <Link href={item.href}>
                  <h3 className="line-clamp-2 min-h-[40px] text-[16px] font-semibold leading-tight text-black transition-colors hover:text-[#ff7a3d]">{item.title}</h3>
                </Link>
                <div className="my-4 h-px bg-gray-200" />
                <div className="mt-auto flex items-center justify-between gap-3">
                  <p className="text-[18px] font-black leading-none text-black">
                    {item.price === null ? (
                      <span className="text-[13px] font-semibold text-black/50">Prix sur demande</span>
                    ) : item.price === 0 ? (
                      'Gratuit'
                    ) : (
                      formatCurrency(item.price, item.currency)
                    )}
                  </p>
                  {item.addToCart ? (
                    <button
                      type="button"
                      onClick={() => {
                        addItem(item.addToCart!);
                        toast.success('Ajouté au panier !');
                      }}
                      className="inline-flex h-[40px] shrink-0 items-center gap-2 bg-black px-4 text-[12px] font-semibold text-white transition-colors hover:bg-[#ff7a3d] active:scale-[0.97]"
                    >
                      <ShoppingCart className="h-4 w-4" /> Ajouter
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="inline-flex h-[40px] shrink-0 items-center gap-1.5 px-4 text-[12px] font-semibold text-black ring-1 ring-black/15 transition-colors hover:bg-black hover:text-white"
                    >
                      {item.price === 0 ? 'Commencer' : 'Voir la fiche'}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
