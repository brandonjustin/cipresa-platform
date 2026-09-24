'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShoppingBag, Trash2, MapPin, User,
  Package, BookOpen, Truck, Shield, CreditCard, Check,
  ArrowLeft, ArrowUpRight, Minus, Plus, Loader2, AlertTriangle, Smartphone,
  XCircle, HelpCircle, RotateCcw, MessageCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { PageTransition, AnimatedSection } from '@/components/animations/motion-components';
import { useCartStore } from '@/lib/store/cart-store';
import { useUIStore } from '@/lib/store/ui-store';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import { createOrderAndInitiatePayment } from '@/lib/actions/checkout';
import { classifyPaymentFailure, type PaymentFailureInfo } from '@/lib/payments/failure-reasons';
import { BgImage } from '@/components/ui/bg-image';

type Step = 'form' | 'waiting' | 'success' | 'failed' | 'timeout';

const PAYMENT_POLL_TIMEOUT_MS = 2 * 60 * 1000;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const toggleCart = useUIStore((s) => s.toggleCart);
  const [step, setStep] = useState<Step>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [failureInfo, setFailureInfo] = useState<PaymentFailureInfo | null>(null);
  const orderIdRef = useRef<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    mobileMoneyOperator: 'MTN_MOMO' as 'MTN_MOMO' | 'ORANGE_MONEY',
    address: '',
    city: '',
    notes: '',
  });

  const courses = items.filter((i) => i.type === 'course');
  const products = items.filter((i) => i.type === 'product');
  const total = getTotal();

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<'fullName' | 'email' | 'phone', string>>>({});

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (field in fieldErrors) setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const errors: typeof fieldErrors = {};
    if (!form.fullName.trim()) errors.fullName = 'Indiquez votre nom complet.';
    if (!form.email.trim()) errors.email = 'Indiquez votre email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Adresse email invalide.';
    if (!form.phone.trim()) errors.phone = 'Indiquez le numéro Mobile Money.';
    else if (form.phone.replace(/\D/g, '').length < 9) errors.phone = 'Numéro trop court.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const pollPaymentStatus = (orderId: string) => {
    const pollStartedAt = Date.now();
    pollRef.current = setInterval(async () => {
      // Nokash's own error-handling guide says an ambiguous initiate response
      // ("platform misbehaving") must not be treated as a definite failure —
      // the payin may still go through server-side. So we keep polling
      // instead of showing "failed", but cap it: if nothing resolves within
      // this window (no webhook, no confirmable status), stop and tell the
      // customer we couldn't confirm rather than spinning forever.
      if (Date.now() - pollStartedAt > PAYMENT_POLL_TIMEOUT_MS) {
        if (pollRef.current) clearInterval(pollRef.current);
        setStep('timeout');
        return;
      }
      try {
        const res = await fetch(`/api/payments/nokash/status?orderId=${orderId}`);
        const data = await res.json();
        if (data.status === 'paid') {
          if (pollRef.current) clearInterval(pollRef.current);
          clearCart();
          setStep('success');
        } else if (data.status === 'failed') {
          if (pollRef.current) clearInterval(pollRef.current);
          setFailureInfo(classifyPaymentFailure(data.message));
          setStep('failed');
        }
      } catch {
        // transient network error — keep polling, next tick will retry
      }
    }, 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Veuillez vérifier les champs indiqués');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const outcome = await createOrderAndInitiatePayment({
        items: items.map((i) => ({ type: i.type, itemId: i.itemId, quantity: i.quantity })),
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        mobileMoneyOperator: form.mobileMoneyOperator,
        address: form.address || undefined,
        city: form.city || undefined,
        notes: form.notes || undefined,
      });
      orderIdRef.current = outcome.orderId;
      if (!outcome.requiresPayment) {
        clearCart();
        setStep('success');
      } else if (outcome.paymentFailed) {
        setFailureInfo(classifyPaymentFailure(outcome.failureReason));
        setStep('failed');
      } else {
        setStep('waiting');
        pollPaymentStatus(outcome.orderId);
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Une erreur est survenue.');
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'waiting') {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
          <div className="max-w-lg mx-auto px-4 py-20 text-center">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="w-20 h-20 rounded-full bg-cipresa-100 dark:bg-cipresa-900/30 flex items-center justify-center mx-auto mb-6"
            >
              <Smartphone className="w-10 h-10 text-cipresa-600" />
            </motion.div>
            <h1 className="text-2xl font-bold mb-3">Confirmez sur votre téléphone</h1>
            <p className="text-gray-500 mb-2">
              Une demande de paiement {form.mobileMoneyOperator === 'ORANGE_MONEY' ? 'Orange Money' : 'MTN Mobile Money'} a été envoyée au <strong>{form.phone}</strong>.
            </p>
            <p className="text-gray-400 text-sm">Approuvez la demande sur votre téléphone pour finaliser la commande.</p>
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" /> En attente de confirmation...
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (step === 'timeout') {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
          <div className="max-w-lg mx-auto px-4 py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold mb-3">Confirmation en attente</h1>
            <p className="text-gray-500 mb-2">
              Nous n&apos;avons pas pu confirmer votre paiement immédiatement. Si vous avez été débité, votre commande sera validée automatiquement dès réception de la confirmation.
            </p>
            <p className="text-gray-400 text-sm mb-8">Consultez vos commandes dans quelques minutes, ou contactez-nous si rien n&apos;apparaît.</p>
            <div className="flex items-center justify-center gap-3 mb-6">
              <Link href="/dashboard/orders">
                <Button variant="outline">Mes commandes</Button>
              </Link>
              <Link href="/contact">
                <Button>Nous contacter</Button>
              </Link>
            </div>
            {orderIdRef.current && (
              <p className="text-center text-xs text-gray-400">
                Référence de commande : <span className="font-mono text-gray-500 dark:text-gray-400">{orderIdRef.current.slice(0, 8).toUpperCase()}</span> — mentionnez-la si vous contactez le support.
              </p>
            )}
          </div>
        </div>
      </PageTransition>
    );
  }

  if (step === 'failed') {
    const info = failureInfo ?? classifyPaymentFailure();
    const orderRef = orderIdRef.current ? orderIdRef.current.slice(0, 8).toUpperCase() : null;
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
          <div className="max-w-lg mx-auto px-4 py-16">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-6"
              >
                <XCircle className="w-10 h-10 text-red-500" />
              </motion.div>
              <h1 className="text-2xl font-bold mb-2">{info.title}</h1>
              <p className="text-gray-500">{info.description}</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cipresa-500" /> Que faire maintenant ?
              </h2>
              <ol className="space-y-3">
                {info.steps.map((stepText, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-cipresa-50 dark:bg-cipresa-950/50 text-cipresa-600 dark:text-cipresa-400 text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {stepText}
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
              <Button
                fullWidth
                onClick={() => {
                  setFailureInfo(null);
                  setStep('form');
                }}
              >
                <span className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Réessayer le paiement
                </span>
              </Button>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button variant="outline" fullWidth>
                  <span className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" /> Contacter le support
                  </span>
                </Button>
              </Link>
            </div>

            {orderRef && (
              <p className="text-center text-xs text-gray-400">
                Référence de commande : <span className="font-mono text-gray-500 dark:text-gray-400">{orderRef}</span> — mentionnez-la si vous contactez le support.
              </p>
            )}
          </div>
        </div>
      </PageTransition>
    );
  }

  if (step === 'success') {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
          <div className="max-w-lg mx-auto px-4 py-20 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full bg-cipresa-100 dark:bg-cipresa-900/30 flex items-center justify-center mx-auto mb-6"
            >
              <Check className="w-10 h-10 text-cipresa-600" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-3">Commande confirmée !</h1>
            <p className="text-gray-500 mb-2">
              Merci <strong>{form.fullName}</strong>, votre commande a été reçue avec succès.
            </p>
            <p className="text-gray-400 text-sm mb-8">
              Un email de confirmation sera envoyé à <strong>{form.email}</strong>.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/dashboard">
                <Button variant="outline">Mon tableau de bord</Button>
              </Link>
              <Link href="/courses">
                <Button>Explorer nos formations</Button>
              </Link>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
          <div className="max-w-lg mx-auto px-4 py-20 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Votre panier est vide</h1>
            <p className="text-gray-500 mb-6">Ajoutez des cours ou des produits avant de commander.</p>
            <Link href="/courses">
              <Button>Découvrir nos formations</Button>
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const operatorLabel = form.mobileMoneyOperator === 'ORANGE_MONEY' ? 'Orange Money' : 'MTN Mobile Money';
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#f6f5f2] pt-[60px] font-[var(--font-poppins)]">
        <div className="mx-auto max-w-[1520px] px-6 pb-20 pt-8 sm:px-10 lg:px-14 lg:pt-10">
          <button type="button" onClick={toggleCart} className="group inline-flex items-center gap-2.5 text-[13px] font-semibold text-black">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 transition-all duration-300 group-hover:-translate-x-0.5 group-hover:border-black group-hover:bg-black group-hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" />
            </span>
            Retour au panier
          </button>

          <div className="mt-8 grid gap-6 border-t border-black pt-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 bg-white px-3 py-1.5 text-[12px] font-semibold leading-none text-black ring-1 ring-black/10">
                <ShoppingBag className="h-3.5 w-3.5 text-[#ff7a3d]" />
                Commande
              </span>
              <h1 className="mt-5 font-display text-[34px] font-medium leading-[0.95] text-black sm:text-[46px] lg:text-[56px]">
                Finaliser
                <span className="block">la commande</span>
              </h1>
            </div>
            {/* Progress */}
            <ol className="flex items-center gap-2 text-[12px] font-semibold">
              {['Panier', 'Informations', 'Paiement'].map((label, i) => (
                <li key={label} className="flex items-center gap-2">
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full text-[11px]',
                      i === 0 ? 'bg-black text-white' : i === 1 ? 'bg-[#ff7a3d] text-white' : 'bg-white text-black/50 ring-1 ring-black/10'
                    )}
                  >
                    {i === 0 ? <Check className="h-3 w-3" /> : i + 1}
                  </span>
                  <span className={i === 2 ? 'text-black/45' : 'text-black'}>{label}</span>
                  {i < 2 && <span className="mx-1 h-px w-6 bg-black/15" aria-hidden="true" />}
                </li>
              ))}
            </ol>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-10">
              <div className="space-y-5">
                {/* 01 Personal info */}
                <AnimatedSection direction="up" delay={0.05}>
                  <fieldset className="bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:p-8">
                    <legend className="sr-only">Informations personnelles</legend>
                    <StepTitle number="01" icon={User} title="Informations personnelles" />
                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      <CheckoutField
                        id="checkout-name"
                        label="Nom complet"
                        required
                        value={form.fullName}
                        onChange={(v) => updateField('fullName', v)}
                        placeholder="Jean Dupont"
                        autoComplete="name"
                        error={fieldErrors.fullName}
                      />
                      <CheckoutField
                        id="checkout-email"
                        label="Email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(v) => updateField('email', v)}
                        placeholder="jean@example.com"
                        autoComplete="email"
                        error={fieldErrors.email}
                      />
                    </div>
                  </fieldset>
                </AnimatedSection>

                {/* 02 Delivery */}
                {products.length > 0 && (
                  <AnimatedSection direction="up" delay={0.1}>
                    <fieldset className="bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:p-8">
                      <legend className="sr-only">Adresse de livraison</legend>
                      <StepTitle number="02" icon={MapPin} title="Adresse de livraison" />
                      <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <CheckoutField
                            id="checkout-address"
                            label="Adresse"
                            value={form.address}
                            onChange={(v) => updateField('address', v)}
                            placeholder="Quartier, rue, numéro"
                            autoComplete="street-address"
                          />
                        </div>
                        <CheckoutField
                          id="checkout-city"
                          label="Ville"
                          value={form.city}
                          onChange={(v) => updateField('city', v)}
                          placeholder="Yaoundé"
                          autoComplete="address-level2"
                        />
                        <CheckoutField
                          id="checkout-notes"
                          label="Notes"
                          value={form.notes}
                          onChange={(v) => updateField('notes', v)}
                          placeholder="Instructions particulières"
                        />
                      </div>
                    </fieldset>
                  </AnimatedSection>
                )}

                {/* 03 Payment */}
                <AnimatedSection direction="up" delay={0.15}>
                  <fieldset className="bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:p-8">
                    <legend className="sr-only">Mode de paiement</legend>
                    <StepTitle number={products.length > 0 ? '03' : '02'} icon={CreditCard} title="Mode de paiement" />
                    <div className="mt-6 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Opérateur Mobile Money">
                      {(
                        [
                          { value: 'MTN_MOMO', label: 'MTN Mobile Money', dot: 'bg-yellow-400' },
                          { value: 'ORANGE_MONEY', label: 'Orange Money', dot: 'bg-orange-500' },
                        ] as const
                      ).map((option) => {
                        const active = form.mobileMoneyOperator === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => setForm((f) => ({ ...f, mobileMoneyOperator: option.value }))}
                            className={cn(
                              'relative flex items-center gap-3 px-4 py-4 text-left text-[13px] font-semibold transition-all duration-300',
                              active ? 'bg-black text-white' : 'bg-[#f6f5f2] text-black hover:ring-1 hover:ring-black/20'
                            )}
                          >
                            <span className={cn('h-3 w-3 shrink-0 rounded-full', option.dot)} aria-hidden="true" />
                            <span className="flex-1">{option.label}</span>
                            <span
                              className={cn(
                                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                                active ? 'bg-[#ff7a3d] text-white' : 'ring-1 ring-black/20'
                              )}
                            >
                              {active && <Check className="h-3 w-3" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-5">
                      <CheckoutField
                        id="checkout-phone"
                        label={`Numéro ${operatorLabel}`}
                        type="tel"
                        inputMode="tel"
                        required
                        value={form.phone}
                        onChange={(v) => updateField('phone', v)}
                        placeholder="2376XXXXXXXX"
                        autoComplete="tel"
                        error={fieldErrors.phone}
                        hint="Le numéro qui recevra la demande de paiement."
                      />
                    </div>
                    <div className="mt-5 flex items-start gap-3 bg-[#f6f5f2] p-4">
                      <Shield className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <p className="text-[13px] font-medium leading-snug text-black/70">
                        Paiement {operatorLabel} sécurisé via Nokash. Vous recevrez une demande de confirmation sur votre téléphone.
                      </p>
                    </div>
                    {errorMessage && (
                      <p role="alert" className="mt-4 flex items-start gap-2 bg-red-50 p-3 text-[13px] font-medium text-red-600">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                        {errorMessage}
                      </p>
                    )}
                  </fieldset>
                </AnimatedSection>
              </div>

              {/* Summary */}
              <div>
                <AnimatedSection direction="up" delay={0.1} className="lg:sticky lg:top-24">
                  <div className="overflow-hidden bg-white shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
                    <div className="flex items-end justify-between gap-4 px-6 pb-4 pt-6 sm:px-7">
                      <h2 className="font-display text-[26px] font-medium leading-none text-black">Récapitulatif</h2>
                      <span className="text-[12px] font-medium text-black/50">
                        {itemCount} article{itemCount > 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="max-h-[420px] space-y-5 overflow-y-auto px-6 pb-2 sm:px-7">
                      {courses.length > 0 && (
                        <div>
                          <p className="flex items-center gap-1.5 text-[12px] font-semibold text-black/50">
                            <BookOpen className="h-3.5 w-3.5 text-[#ff7a3d]" /> Formations ({courses.length})
                          </p>
                          <ul className="mt-2 grid gap-px overflow-hidden bg-gray-200 ring-1 ring-gray-200">
                            {courses.map((item) => (
                              <li key={item.id} className="flex items-center gap-3 bg-white p-3">
                                <BgImage src={item.image} className="h-12 w-14 shrink-0 bg-[#f6f5f2]" sizes="160px" />
                                <div className="min-w-0 flex-1">
                                  <p className="line-clamp-2 text-[13px] font-semibold leading-tight text-black">{item.name}</p>
                                  <p className="mt-1 text-[13px] font-black text-black">{formatCurrency(item.price)}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeItem(item.id)}
                                  aria-label={`Retirer ${item.name}`}
                                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-black/35 transition-colors hover:bg-red-50 hover:text-red-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {products.length > 0 && (
                        <div>
                          <p className="flex items-center gap-1.5 text-[12px] font-semibold text-black/50">
                            <Package className="h-3.5 w-3.5 text-[#ff7a3d]" /> Produits ({products.length})
                          </p>
                          <ul className="mt-2 grid gap-px overflow-hidden bg-gray-200 ring-1 ring-gray-200">
                            {products.map((item) => (
                              <li key={item.id} className="flex items-center gap-3 bg-white p-3">
                                <BgImage src={item.image} className="h-12 w-14 shrink-0 bg-[#f6f5f2]" sizes="160px" />
                                <div className="min-w-0 flex-1">
                                  <p className="line-clamp-2 text-[13px] font-semibold leading-tight text-black">{item.name}</p>
                                  <p className="mt-1 text-[13px] font-black text-black">
                                    {formatCurrency(item.price * item.quantity)}
                                    {item.quantity > 1 && (
                                      <span className="ml-1.5 text-[11px] font-medium text-black/45">({formatCurrency(item.price)} × {item.quantity})</span>
                                    )}
                                  </p>
                                </div>
                                <div className="flex h-8 shrink-0 items-center ring-1 ring-black/10">
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    aria-label={`Réduire la quantité de ${item.name}`}
                                    className="flex h-full w-7 items-center justify-center text-black transition-colors hover:bg-black hover:text-white"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="w-6 text-center text-[12px] font-semibold text-black">{item.quantity}</span>
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    aria-label={`Augmenter la quantité de ${item.name}`}
                                    className="flex h-full w-7 items-center justify-center text-black transition-colors hover:bg-black hover:text-white"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeItem(item.id)}
                                  aria-label={`Retirer ${item.name}`}
                                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-black/35 transition-colors hover:bg-red-50 hover:text-red-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <dl className="mx-6 mt-5 space-y-2.5 border-t border-gray-200 pt-5 sm:mx-7">
                      <div className="flex items-center justify-between text-[13px] font-medium text-black/60">
                        <dt>Sous-total</dt>
                        <dd>{formatCurrency(total)}</dd>
                      </div>
                      {products.length > 0 && (
                        <div className="flex items-center justify-between text-[13px] font-medium text-black/60">
                          <dt className="flex items-center gap-1.5">
                            <Truck className="h-3.5 w-3.5" /> Livraison
                          </dt>
                          <dd className="font-semibold text-emerald-600">Gratuit</dd>
                        </div>
                      )}
                    </dl>

                    <div className="relative mt-5 overflow-hidden bg-[#ff7a3d] px-6 py-5 text-white sm:px-7">
                      <div
                        aria-hidden="true"
                        className="absolute -bottom-20 -right-8 h-[160px] w-[160px] rounded-full border border-white/35 opacity-70"
                        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
                      />
                      <div className="relative flex items-baseline justify-between gap-4">
                        <span className="text-[14px] font-semibold">Total</span>
                        <span className="text-[30px] font-black leading-none">{formatCurrency(total)}</span>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-5 sm:px-7">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative flex h-[54px] w-full items-center justify-center gap-2 overflow-hidden bg-black text-[14px] font-semibold text-white transition-colors duration-300 hover:bg-[#ff7a3d] disabled:cursor-wait disabled:opacity-80"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" /> Traitement en cours...
                          </>
                        ) : (
                          <>
                            Passer la commande
                            <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
                          </>
                        )}
                      </button>
                      <p className="mt-4 flex items-center justify-center gap-2 text-[12px] font-medium text-black/50">
                        <Shield className="h-3.5 w-3.5 text-emerald-600" />
                        Paiement sécurisé via Nokash
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}

function StepTitle({ number, icon: Icon, title }: { number: string; icon: typeof User; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-[26px] font-black leading-none text-[#ff7a3d]">{number}</span>
      <h2 className="flex items-center gap-2 text-[18px] font-semibold text-black">
        <Icon className="h-4 w-4 text-black/40" />
        {title}
      </h2>
    </div>
  );
}

function CheckoutField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  error,
  hint,
  autoComplete,
  inputMode,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[12px] font-semibold text-black">
        {label} {required && <span className="text-[#ff7a3d]">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        required={required}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={cn(
          'h-[48px] w-full bg-[#f6f5f2] px-4 text-[14px] font-medium text-black ring-1 transition-all duration-300 placeholder:text-black/35 focus:bg-white focus:outline-none focus:ring-2',
          error ? 'ring-red-400 focus:ring-red-400' : 'ring-transparent hover:ring-black/15 focus:ring-[#ff7a3d]'
        )}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[12px] font-medium text-red-500">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[12px] font-medium text-black/45">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
