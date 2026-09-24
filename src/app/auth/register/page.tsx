'use client';

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Mail, Lock, User, Phone, Eye, EyeOff, ArrowUpRight, ArrowLeft, Check, Loader2,
  AlertTriangle, GraduationCap, Sprout, Handshake, MailCheck, RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { BgImage } from '@/components/ui/bg-image';
import { signUpWithPassword, resendSignUpConfirmation } from '@/lib/auth/actions';

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const perks = [
  { icon: GraduationCap, text: 'Des formations de qualité' },
  { icon: Sprout, text: 'Des produits certifiés' },
  { icon: Handshake, text: 'Un accompagnement personnalisé' },
];

type Field = 'fullName' | 'email' | 'phone' | 'password';

function passwordChecks(pw: string) {
  return [
    { label: '8 caractères minimum', pass: pw.length >= 8 },
    { label: 'Une majuscule', pass: /[A-Z]/.test(pw) },
    { label: 'Une minuscule', pass: /[a-z]/.test(pw) },
    { label: 'Un chiffre', pass: /\d/.test(pw) },
  ];
}

const strengthLabels = ['Trop faible', 'Faible', 'Moyen', 'Bon', 'Fort'];
const strengthColors = ['bg-red-500', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500'];

function validateField(field: Field, value: string): string | undefined {
  const v = value.trim();
  switch (field) {
    case 'fullName':
      if (!v) return 'Indiquez votre nom complet.';
      if (v.length < 2) return 'Nom trop court.';
      return undefined;
    case 'email':
      if (!v) return 'Indiquez votre email.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Adresse email invalide.';
      return undefined;
    case 'phone':
      if (v && v.replace(/\D/g, '').length < 9) return 'Numéro invalide (9 chiffres minimum).';
      return undefined;
    case 'password':
      if (!value) return 'Choisissez un mot de passe.';
      if (value.length < 8) return 'Minimum 8 caractères.';
      return undefined;
  }
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? undefined;
  const [form, setForm] = useState<Record<Field, string>>({ fullName: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  const checks = useMemo(() => passwordChecks(form.password), [form.password]);
  const score = checks.filter((c) => c.pass).length;

  const update = (field: Field, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setFormError(null);
    // Re-validate live once the field has been visited, so errors clear as the user fixes them.
    if (touched[field]) setErrors((e) => ({ ...e, [field]: validateField(field, value) }));
  };

  const blur = (field: Field) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validateField(field, form[field]) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fields: Field[] = ['fullName', 'email', 'phone', 'password'];
    const nextErrors: Partial<Record<Field, string>> = {};
    fields.forEach((f) => {
      const err = validateField(f, form[f]);
      if (err) nextErrors[f] = err;
    });
    setErrors(nextErrors);
    setTouched({ fullName: true, email: true, phone: true, password: true });
    setTermsError(!acceptedTerms);
    if (Object.keys(nextErrors).length > 0 || !acceptedTerms) {
      document.getElementById(`register-${Object.keys(nextErrors)[0] ?? 'terms'}`)?.focus();
      return;
    }

    setFormError(null);
    setIsSubmitting(true);
    try {
      const outcome = await signUpWithPassword({
        email: form.email.trim(),
        password: form.password,
        fullName: form.fullName.trim(),
        phone: form.phone.trim() || undefined,
        next,
      });
      if (outcome.status === 'signed-in') {
        toast.success('Bienvenue sur CIPRESA !');
        // Full navigation so middleware sees the fresh session (same reason as the login page).
        window.location.href = next || '/dashboard';
        return;
      }
      setSentTo(form.email.trim());
      setIsSubmitting(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Une erreur est survenue lors de l'inscription.");
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!sentTo) return;
    setIsResending(true);
    try {
      await resendSignUpConfirmation(sentTo, next);
      toast.success('Email de confirmation renvoyé.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Impossible de renvoyer l’email pour le moment.');
    } finally {
      setIsResending(false);
    }
  };

  const loginHref = next ? `/auth/login?next=${encodeURIComponent(next)}` : '/auth/login';

  const inputClass = (field: Field) =>
    cn(
      'h-[50px] w-full bg-[#f6f5f2] pl-11 pr-4 text-[14px] font-medium text-black ring-1 transition-all duration-300 placeholder:text-black/35 focus:bg-white focus:outline-none focus:ring-2',
      touched[field] && errors[field] ? 'ring-red-300 focus:ring-red-400' : 'ring-transparent hover:ring-black/15 focus:ring-[#ff7a3d]'
    );

  const fieldError = (field: Field) =>
    touched[field] && errors[field] ? (
      <p id={`register-${field}-error`} className="mt-1.5 text-[12px] font-medium text-red-500">
        {errors[field]}
      </p>
    ) : null;

  return (
    <div className="flex min-h-screen bg-white font-[var(--font-poppins)]">
      {/* Visual side */}
      <div className="relative hidden flex-1 overflow-hidden bg-black lg:block">
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: [0.22, 1, 0.36, 1] }}
        >
          <BgImage src="/images/6014849480848510224.jpg" className="h-full w-full" sizes="50vw" objectPosition="center 20%" priority />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />

        <div className="relative flex h-full flex-col justify-end p-12 xl:p-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
            className="max-w-[520px]"
          >
            <motion.h2 variants={reveal} className="font-display text-[44px] font-medium leading-[0.95] text-white xl:text-[54px]">
              Rejoignez
              <span className="block">CIPRESA</span>
            </motion.h2>
            <motion.p variants={reveal} className="mt-5 text-[15px] font-medium leading-[1.6] text-white/80">
              Créez votre compte et accédez à des formations de qualité, des produits certifiés et un accompagnement personnalisé.
            </motion.p>
            <motion.ul variants={reveal} className="mt-8 grid gap-px overflow-hidden bg-white/15 ring-1 ring-white/15">
              {perks.map((perk, i) => (
                <li
                  key={perk.text}
                  className={cn('flex items-center gap-3 px-5 py-4 text-[14px] font-semibold text-white', i === 0 ? 'bg-[#ff7a3d]' : 'bg-black/40 backdrop-blur-md')}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/40">
                    <perk.icon className="h-4 w-4" />
                  </span>
                  {perk.text}
                </li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex flex-1 flex-col px-6 py-8 sm:px-10 lg:px-16">
        <div className="mx-auto flex w-full max-w-[440px] items-center justify-between">
          <Link href="/" aria-label="Accueil CIPRESA" className="-ml-1">
            <Image src="/images/logo.png" alt="CIPRESA Consulting" width={150} height={60} className="h-11 w-auto object-contain object-left" priority />
          </Link>
          <Link href="/" className="group inline-flex items-center gap-2 text-[12px] font-semibold text-black/60 transition-colors hover:text-black">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Retour au site
          </Link>
        </div>

        <div className="flex flex-1 items-start justify-center pb-8 pt-10 lg:pt-14">
          <AnimatePresence mode="wait">
            {sentTo ? (
              /* Confirmation state */
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-[440px]"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.1 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ff7a3d] text-white"
                >
                  <MailCheck className="h-7 w-7" />
                </motion.span>
                <h1 className="mt-6 font-display text-[28px] font-medium leading-[1] text-black sm:text-[34px]">
                  Vérifiez
                  <span className="block">votre email</span>
                </h1>
                <p className="mt-4 text-[15px] font-medium leading-[1.6] text-black/65">
                  Nous avons envoyé un lien de confirmation à <strong className="font-semibold text-black">{sentTo}</strong>. Cliquez dessus pour activer votre compte.
                </p>

                <ul className="mt-8 grid gap-px overflow-hidden bg-gray-200 ring-1 ring-gray-200">
                  {['Ouvrez votre boîte de réception', 'Cliquez sur le lien « Confirmer »', 'Vous serez connecté automatiquement'].map((step, i) => (
                    <li key={step} className="flex items-center gap-4 bg-white px-5 py-4">
                      <span className="text-[18px] font-black leading-none text-[#ff7a3d]">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-[14px] font-medium text-black">{step}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-6 text-[13px] font-medium text-black/55">
                  Rien reçu ? Vérifiez vos spams, ou renvoyez l’email.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="inline-flex h-[46px] items-center gap-2 bg-black px-6 text-[13px] font-semibold text-white transition-colors hover:bg-[#ff7a3d] disabled:opacity-70"
                  >
                    {isResending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                    Renvoyer l’email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSentTo(null);
                      setForm((f) => ({ ...f, password: '' }));
                    }}
                    className="inline-flex h-[46px] items-center px-6 text-[13px] font-semibold text-black ring-1 ring-black/15 transition-colors hover:bg-[#f6f5f2]"
                  >
                    Modifier l’email
                  </button>
                </div>
                <p className="mt-10 text-[13px] font-medium text-black/60">
                  Déjà confirmé ?{' '}
                  <Link href={loginHref} className="font-semibold text-black underline decoration-[#ff7a3d] decoration-2 underline-offset-4 hover:text-[#ff7a3d]">
                    Se connecter
                  </Link>
                </p>
              </motion.div>
            ) : (
              /* Form state */
              <motion.div
                key="form"
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
                className="w-full max-w-[440px]"
              >
                <motion.div variants={reveal}>
                  <h1 className="font-display text-[28px] font-medium leading-[1] text-black sm:text-[34px]">
                    Créer
                    <span className="block">un compte</span>
                  </h1>
                  <p className="mt-4 text-[15px] font-medium text-black/60">Rejoignez la communauté CIPRESA</p>
                </motion.div>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
                  <motion.div variants={reveal}>
                    <label htmlFor="register-fullName" className="mb-2 block text-[12px] font-semibold text-black">
                      Nom complet <span className="text-[#ff7a3d]">*</span>
                    </label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
                      <input
                        id="register-fullName"
                        type="text"
                        autoComplete="name"
                        placeholder="Votre nom"
                        value={form.fullName}
                        onChange={(e) => update('fullName', e.target.value)}
                        onBlur={() => blur('fullName')}
                        aria-invalid={!!(touched.fullName && errors.fullName)}
                        aria-describedby={touched.fullName && errors.fullName ? 'register-fullName-error' : undefined}
                        className={inputClass('fullName')}
                      />
                    </div>
                    {fieldError('fullName')}
                  </motion.div>

                  <motion.div variants={reveal} className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="register-email" className="mb-2 block text-[12px] font-semibold text-black">
                        Email <span className="text-[#ff7a3d]">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
                        <input
                          id="register-email"
                          type="email"
                          autoComplete="email"
                          placeholder="votre@email.com"
                          value={form.email}
                          onChange={(e) => update('email', e.target.value)}
                          onBlur={() => blur('email')}
                          aria-invalid={!!(touched.email && errors.email)}
                          aria-describedby={touched.email && errors.email ? 'register-email-error' : undefined}
                          className={inputClass('email')}
                        />
                      </div>
                      {fieldError('email')}
                    </div>
                    <div>
                      <label htmlFor="register-phone" className="mb-2 block text-[12px] font-semibold text-black">
                        Téléphone <span className="font-medium text-black/40">(optionnel)</span>
                      </label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
                        <input
                          id="register-phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="+237 6XX XXX XXX"
                          value={form.phone}
                          onChange={(e) => update('phone', e.target.value)}
                          onBlur={() => blur('phone')}
                          aria-invalid={!!(touched.phone && errors.phone)}
                          aria-describedby={touched.phone && errors.phone ? 'register-phone-error' : undefined}
                          className={inputClass('phone')}
                        />
                      </div>
                      {fieldError('phone')}
                    </div>
                  </motion.div>

                  <motion.div variants={reveal}>
                    <label htmlFor="register-password" className="mb-2 block text-[12px] font-semibold text-black">
                      Mot de passe <span className="text-[#ff7a3d]">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
                      <input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Minimum 8 caractères"
                        value={form.password}
                        onChange={(e) => update('password', e.target.value)}
                        onBlur={() => blur('password')}
                        aria-invalid={!!(touched.password && errors.password)}
                        aria-describedby="register-password-rules"
                        className={cn(inputClass('password'), 'pr-12')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                        className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-black/45 transition-colors hover:bg-black/5 hover:text-black"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {fieldError('password')}

                    {/* Strength */}
                    <div id="register-password-rules" className="mt-3">
                      <div className="flex items-center gap-3">
                        <div className="grid flex-1 grid-cols-4 gap-1">
                          {[0, 1, 2, 3].map((i) => (
                            <span
                              key={i}
                              className={cn('h-1 transition-colors duration-300', form.password && i < score ? strengthColors[score] : 'bg-black/10')}
                            />
                          ))}
                        </div>
                        <span className="w-20 text-right text-[11px] font-semibold text-black/60">
                          {form.password ? strengthLabels[score] : ''}
                        </span>
                      </div>
                      <ul className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5">
                        {checks.map((c) => (
                          <li key={c.label} className={cn('flex items-center gap-1.5 text-[12px] font-medium transition-colors', c.pass ? 'text-black' : 'text-black/40')}>
                            <span
                              className={cn(
                                'flex h-3.5 w-3.5 items-center justify-center rounded-full transition-colors',
                                c.pass ? 'bg-emerald-500 text-white' : 'ring-1 ring-black/20'
                              )}
                            >
                              {c.pass && <Check className="h-2.5 w-2.5" />}
                            </span>
                            {c.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>

                  <motion.div variants={reveal}>
                    <label className="flex cursor-pointer items-start gap-3 text-[13px] font-medium text-black/65">
                      <span className="relative mt-0.5 flex h-5 w-5 shrink-0">
                        <input
                          id="register-terms"
                          type="checkbox"
                          checked={acceptedTerms}
                          onChange={(e) => {
                            setAcceptedTerms(e.target.checked);
                            if (e.target.checked) setTermsError(false);
                          }}
                          className="peer absolute inset-0 cursor-pointer appearance-none bg-[#f6f5f2] ring-1 ring-black/20 transition-colors checked:bg-[#ff7a3d] checked:ring-[#ff7a3d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7a3d]"
                        />
                        <Check className="pointer-events-none relative m-auto h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100" />
                      </span>
                      <span>
                        J&apos;accepte les{' '}
                        <Link href="/terms" className="font-semibold text-black underline underline-offset-2 hover:text-[#ff7a3d]">
                          conditions d&apos;utilisation
                        </Link>{' '}
                        et la{' '}
                        <Link href="/privacy" className="font-semibold text-black underline underline-offset-2 hover:text-[#ff7a3d]">
                          politique de confidentialité
                        </Link>
                      </span>
                    </label>
                    {termsError && <p className="mt-1.5 pl-8 text-[12px] font-medium text-red-500">Veuillez accepter les conditions pour continuer.</p>}
                  </motion.div>

                  {formError && (
                    <p role="alert" className="flex items-start gap-2 bg-red-50 p-3 text-[13px] font-medium text-red-600">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>
                        {formError}
                        {formError.includes('existe déjà') && (
                          <>
                            {' '}
                            <Link href={loginHref} className="font-semibold underline">
                              Se connecter
                            </Link>
                          </>
                        )}
                      </span>
                    </p>
                  )}

                  <motion.div variants={reveal} className="pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative flex h-[52px] w-full items-center justify-center gap-2 overflow-hidden bg-[#ff7a3d] text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(255,122,61,0.35)] disabled:translate-y-0 disabled:opacity-80 disabled:shadow-none"
                    >
                      <span aria-hidden="true" className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/35 transition-[left] duration-700 ease-out group-hover:left-[120%]" />
                      {isSubmitting ? (
                        <>
                          <Loader2 className="relative h-5 w-5 animate-spin" />
                          <span className="relative">Création du compte...</span>
                        </>
                      ) : (
                        <>
                          <span className="relative">Créer mon compte</span>
                          <ArrowUpRight className="relative h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
                        </>
                      )}
                    </button>
                  </motion.div>
                </form>

                <motion.p variants={reveal} className="mt-8 text-center text-[13px] font-medium text-black/60">
                  Déjà membre ?{' '}
                  <Link href={loginHref} className="font-semibold text-black underline decoration-[#ff7a3d] decoration-2 underline-offset-4 hover:text-[#ff7a3d]">
                    Se connecter
                  </Link>
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
