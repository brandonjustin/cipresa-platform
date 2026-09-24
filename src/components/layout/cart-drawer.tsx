'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowUpRight, GraduationCap, Package } from 'lucide-react';
import Link from 'next/link';
import { useUIStore } from '@/lib/store/ui-store';
import { useCartStore } from '@/lib/store/cart-store';
import { formatCurrency } from '@/lib/utils/format';
import { BgImage } from '@/components/ui/bg-image';

export const CartDrawer = () => {
  const { isCartOpen, toggleCart } = useUIStore();
  const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCartStore();

  useEffect(() => {
    if (!isCartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggleCart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isCartOpen, toggleCart]);

  const itemCount = getItemCount();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 font-[var(--font-poppins)]" role="dialog" aria-modal="true" aria-label="Panier">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={toggleCart}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="absolute right-0 top-0 h-full w-full max-w-[460px] bg-[#f6f5f2] shadow-[0_0_80px_rgba(0,0,0,0.25)]"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 bg-white px-6 pb-5 pt-6">
                <div className="flex-1 border-t border-black pt-4">
                  <h2 className="font-display text-[28px] font-medium leading-none text-black">Mon panier</h2>
                  <p className="mt-2 text-[12px] font-medium text-black/60">
                    {itemCount} article{itemCount > 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={toggleCart}
                  aria-label="Fermer le panier"
                  className="mt-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/15 text-black transition-all duration-300 hover:rotate-90 hover:border-black hover:bg-black hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ff7a3d]/10 text-[#ff7a3d]">
                    <ShoppingCart className="h-8 w-8 stroke-[1.6]" />
                  </span>
                  <h3 className="mt-6 font-display text-[24px] font-medium leading-tight text-black">Votre panier est vide</h3>
                  <p className="mt-2 max-w-[260px] text-[13px] font-medium leading-snug text-black/60">
                    Explorez nos cours et produits agricoles pour commencer.
                  </p>
                  <div className="mt-7 flex flex-wrap justify-center gap-2">
                    <Link
                      href="/courses"
                      onClick={toggleCart}
                      className="group inline-flex h-[42px] items-center gap-2 bg-black px-6 text-[13px] font-semibold text-white transition-colors hover:bg-[#ff7a3d]"
                    >
                      Nos formations
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                    </Link>
                    <Link
                      href="/marketplace"
                      onClick={toggleCart}
                      className="inline-flex h-[42px] items-center border border-black/20 bg-white px-6 text-[13px] font-semibold text-black transition-colors hover:border-black"
                    >
                      La boutique
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {/* Items */}
                  <div className="flex-1 overflow-y-auto px-6 py-5">
                    <ul className="grid gap-px overflow-hidden bg-gray-200 ring-1 ring-gray-200">
                      <AnimatePresence initial={false}>
                        {items.map((item) => {
                          const isCourse = item.type === 'course';
                          return (
                            <motion.li
                              key={item.id}
                              layout
                              initial={{ opacity: 0, x: 40 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
                              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
                              className="group relative flex gap-4 bg-white p-4"
                            >
                              <span className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-[#ff7a3d] transition-transform duration-500 group-hover:scale-y-100" />
                              <BgImage src={item.image} className="h-[84px] w-[84px] shrink-0 bg-[#f6f5f2]" sizes="168px" />
                              <div className="flex min-w-0 flex-1 flex-col">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#ff7a3d]">
                                      {isCourse ? <GraduationCap className="h-3.5 w-3.5" /> : <Package className="h-3.5 w-3.5" />}
                                      {isCourse ? 'Formation' : 'Produit'}
                                    </span>
                                    <p className="mt-1 line-clamp-2 text-[14px] font-semibold leading-tight text-black">{item.name}</p>
                                  </div>
                                  <button
                                    onClick={() => removeItem(item.id)}
                                    aria-label={`Retirer ${item.name} du panier`}
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-black/40 transition-colors hover:bg-red-50 hover:text-red-500"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>

                                <div className="mt-auto flex items-end justify-between gap-3 pt-3">
                                  {isCourse ? (
                                    <span className="text-[12px] font-medium text-black/50">Acces illimite</span>
                                  ) : (
                                    <div className="flex h-8 items-center border border-black/15">
                                      <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        aria-label={`Réduire la quantité de ${item.name}`}
                                        className="flex h-full w-8 items-center justify-center text-black transition-colors hover:bg-black hover:text-white"
                                      >
                                        <Minus className="h-3.5 w-3.5" />
                                      </button>
                                      <span className="w-8 text-center text-[13px] font-semibold text-black" aria-live="polite">
                                        {item.quantity}
                                      </span>
                                      <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        aria-label={`Augmenter la quantité de ${item.name}`}
                                        className="flex h-full w-8 items-center justify-center text-black transition-colors hover:bg-black hover:text-white"
                                      >
                                        <Plus className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  )}
                                  <div className="text-right">
                                    <p className="text-[16px] font-black leading-none text-black">{formatCurrency(item.price * item.quantity)}</p>
                                    {item.quantity > 1 && (
                                      <p className="mt-1 text-[11px] font-medium text-black/50">{formatCurrency(item.price)} / unite</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.li>
                          );
                        })}
                      </AnimatePresence>
                    </ul>
                  </div>

                  {/* Summary */}
                  <div className="relative overflow-hidden bg-white px-6 pb-6 pt-5 shadow-[0_-18px_50px_rgba(0,0,0,0.06)]">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[12px] font-medium text-black/60">Sous-total</p>
                        <p className="mt-1 text-[11px] font-medium text-black/40">Livraison calculee a la commande</p>
                      </div>
                      <p className="text-[28px] font-black leading-none text-black">{formatCurrency(getTotal())}</p>
                    </div>
                    <div className="my-5 h-px bg-gray-200" />
                    <div className="grid gap-2">
                      <Link
                        href="/checkout"
                        onClick={toggleCart}
                        className="group relative inline-flex h-[50px] items-center justify-center gap-2 overflow-hidden bg-[#ff7a3d] text-[14px] font-semibold text-white transition-colors hover:bg-black"
                      >
                        Commander
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                      </Link>
                      <button
                        onClick={toggleCart}
                        className="h-[42px] text-[13px] font-semibold text-black/70 underline-offset-4 transition-colors hover:text-black hover:underline"
                      >
                        Continuer mes achats
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
