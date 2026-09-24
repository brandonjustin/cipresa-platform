'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, ArrowUpRight, ArrowLeft, Chrome, Smartphone, Loader2, AlertTriangle, GraduationCap, Sprout, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { BgImage } from '@/components/ui/bg-image';
import { signInWithPassword } from '@/lib/auth/actions';

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const perks = [
  { icon: GraduationCap, text: 'Des formations agricoles de qualité' },
  { icon: Sprout, text: 'Des semences et intrants certifiés' },
  { icon: BarChart3, text: 'Le suivi de votre progression' },
];

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // The email-confirmation callback redirects here with ?error=auth_callback_failed
  // when a link is expired or already used.
  const [error, setError] = useState<string | null>(
    searchParams.get('error') === 'auth_callback_failed'
      ? 'Ce lien de confirmation est invalide ou a expiré. Connectez-vous, ou inscrivez-vous à nouveau pour recevoir un nouveau lien.'
      : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password) {
      setError('Veuillez renseigner votre email et votre mot de passe.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await signInWithPassword(form.email.trim(), form.password);
      toast.success('Connexion réussie !');
      // A hard navigation, not router.push(), because the destination is
      // often a protected route (e.g. /dashboard) that the client Router
      // Cache may have already cached as "redirect to /auth/login" from
      // before this session existed — router.push()+router.refresh() can
      // silently replay that stale redirect instead of re-checking with
      // the now-valid session. A full navigation always hits middleware fresh.
      window.location.href = next || '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Identifiants incorrects.');
      setIsSubmitting(false);
    }
  };

  const inputClass = cn(
    'h-[50px] w-full bg-[#f6f5f2] pl-11 pr-4 text-[14px] font-medium text-black ring-1 transition-all duration-300 placeholder:text-black/35 focus:bg-white focus:outline-none focus:ring-2',
    error ? 'ring-red-300 focus:ring-red-400' : 'ring-transparent hover:ring-black/15 focus:ring-[#ff7a3d]'
  );

  return (
    <div className="flex min-h-screen bg-white font-[var(--font-poppins)]">
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
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }}
            className="w-full max-w-[440px]"
          >
            <motion.div variants={reveal}>
              <h1 className="font-display text-[28px] font-medium leading-[1] text-black sm:text-[34px]">
                Content de
                <span className="block">vous revoir</span>
              </h1>
              <p className="mt-4 text-[15px] font-medium text-black/60">Connectez-vous pour accéder à votre espace</p>
            </motion.div>

            <form className="mt-9 space-y-5" onSubmit={handleSubmit} noValidate>
              <motion.div variants={reveal}>
                <label htmlFor="login-email" className="mb-2 block text-[12px] font-semibold text-black">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="votre@email.com"
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      setError(null);
                    }}
                    aria-invalid={!!error}
                    className={inputClass}
                  />
                </div>
              </motion.div>

              <motion.div variants={reveal}>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="login-password" className="block text-[12px] font-semibold text-black">
                    Mot de passe
                  </label>
                  <Link href="/auth/forgot-password" className="text-[12px] font-semibold text-[#ff7a3d] hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Votre mot de passe"
                    value={form.password}
                    onChange={(e) => {
                      setForm({ ...form, password: e.target.value });
                      setError(null);
                    }}
                    aria-invalid={!!error}
                    className={cn(inputClass, 'pr-12')}
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
              </motion.div>

              {error && (
                <p role="alert" className="flex items-start gap-2 bg-red-50 p-3 text-[13px] font-medium text-red-600">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  {error}
                </p>
              )}

              <motion.div variants={reveal}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative flex h-[52px] w-full items-center justify-center gap-2 overflow-hidden bg-[#ff7a3d] text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(255,122,61,0.35)] disabled:translate-y-0 disabled:opacity-80 disabled:shadow-none"
                >
                  <span aria-hidden="true" className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/35 transition-[left] duration-700 ease-out group-hover:left-[120%]" />
                  {isSubmitting ? (
                    <>
                      <Loader2 className="relative h-5 w-5 animate-spin" />
                      <span className="relative">Connexion...</span>
                    </>
                  ) : (
                    <>
                      <span className="relative">Se connecter</span>
                      <ArrowUpRight className="relative h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
                    </>
                  )}
                </button>
              </motion.div>
            </form>

            <motion.div variants={reveal} className="my-8 flex items-center gap-4">
              <span className="h-px flex-1 bg-gray-200" />
              <span className="text-[12px] font-medium text-black/45">ou continuer avec</span>
              <span className="h-px flex-1 bg-gray-200" />
            </motion.div>

            <motion.div variants={reveal} className="grid grid-cols-2 gap-3">
              {[
                { icon: Chrome, label: 'Google', message: 'Connexion Google bientôt disponible' },
                { icon: Smartphone, label: 'Mobile Money', message: 'Connexion Mobile Money bientôt disponible' },
              ].map((provider) => (
                <button
                  key={provider.label}
                  type="button"
                  onClick={() => toast(provider.message, { icon: '🔜' })}
                  className="relative flex h-[48px] items-center justify-center gap-2 text-[13px] font-semibold text-black ring-1 ring-black/15 transition-colors hover:bg-[#f6f5f2]"
                >
                  <provider.icon className="h-4 w-4" />
                  {provider.label}
                  <span className="absolute -top-2 right-2 bg-black px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">Bientôt</span>
                </button>
              ))}
            </motion.div>

            <motion.p variants={reveal} className="mt-10 text-center text-[13px] font-medium text-black/60">
              Pas encore de compte ?{' '}
              <Link
                href={next ? `/auth/register?next=${encodeURIComponent(next)}` : '/auth/register'}
                className="font-semibold text-black underline decoration-[#ff7a3d] decoration-2 underline-offset-4 hover:text-[#ff7a3d]"
              >
                S&apos;inscrire
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Visual side */}
      <div className="relative hidden flex-1 overflow-hidden bg-black lg:block">
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: [0.22, 1, 0.36, 1] }}
        >
          <BgImage src="/images/6014849480848510230.jpg" className="h-full w-full" sizes="50vw" objectPosition="center 15%" priority />
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
              Bienvenue
              <span className="block">sur CIPRESA</span>
            </motion.h2>
            <motion.p variants={reveal} className="mt-5 text-[15px] font-medium leading-[1.6] text-white/80">
              Accédez à des formations agricoles de qualité, achetez des semences certifiées et suivez votre progression.
            </motion.p>
            <motion.ul variants={reveal} className="mt-8 grid gap-px overflow-hidden bg-white/15 ring-1 ring-white/15">
              {perks.map((perk, i) => (
                <li key={perk.text} className={cn('flex items-center gap-3 px-5 py-4 text-[14px] font-semibold text-white', i === 0 ? 'bg-[#ff7a3d]' : 'bg-black/40 backdrop-blur-md')}>
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
    </div>
  );
}
