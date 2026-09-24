'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Mail, MailCheck, Loader2, AlertTriangle, RotateCcw, KeyRound, ShieldCheck, Clock, Leaf } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils/cn';
import { requestPasswordReset } from '@/lib/auth/actions';

const RESEND_COOLDOWN_S = 60;

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const reassurance = [
  { icon: KeyRound, text: 'Choisissez un nouveau mot de passe en 1 minute' },
  { icon: ShieldCheck, text: 'Lien personnel et sécurisé' },
  { icon: Clock, text: 'Vos formations et commandes restent intactes' },
];

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const send = async (address: string) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await requestPasswordReset(address);
      setSentTo(address);
      setCooldown(RESEND_COOLDOWN_S);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) {
      setError('Veuillez renseigner votre email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError('Adresse email invalide.');
      return;
    }
    await send(value);
  };

  const handleResend = async () => {
    if (!sentTo || cooldown > 0) return;
    if (await send(sentTo)) toast.success('Lien renvoyé.');
  };

  return (
    <div className="flex min-h-screen bg-white font-[var(--font-poppins)]">
      {/* Form side */}
      <div className="flex flex-1 flex-col px-6 py-8 sm:px-10 lg:px-16">
        <div className="mx-auto flex w-full max-w-[440px] items-center justify-between">
          <Link href="/" aria-label="Accueil CIPRESA" className="-ml-1">
            <Image src="/images/logo.png" alt="CIPRESA Consulting" width={150} height={60} className="h-11 w-auto object-contain object-left" priority />
          </Link>
          <Link href="/auth/login" className="group inline-flex items-center gap-2 text-[12px] font-semibold text-black/60 transition-colors hover:text-black">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Retour à la connexion
          </Link>
        </div>

        <div className="flex flex-1 items-start justify-center pb-8 pt-10 lg:pt-14">
          <AnimatePresence mode="wait">
            {sentTo ? (
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
                  Vérifiez votre
                  <span className="block">boîte mail</span>
                </h1>
                <p className="mt-4 text-[15px] font-medium leading-[1.6] text-black/65">
                  Si un compte existe pour <strong className="font-semibold text-black">{sentTo}</strong>, un lien de réinitialisation vient de lui être envoyé.
                </p>

                <ul className="mt-8 grid gap-px overflow-hidden bg-gray-200 ring-1 ring-gray-200">
                  {['Ouvrez l’email de CIPRESA', 'Cliquez sur le lien de réinitialisation', 'Choisissez votre nouveau mot de passe'].map((step, i) => (
                    <li key={step} className="flex items-center gap-4 bg-white px-5 py-4">
                      <span className="text-[18px] font-black leading-none text-[#ff7a3d]">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-[14px] font-medium text-black">{step}</span>
                    </li>
                  ))}
                </ul>

                {error && (
                  <p role="alert" className="mt-5 flex items-start gap-2 bg-red-50 p-3 text-[13px] font-medium text-red-600">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    {error}
                  </p>
                )}

                <p className="mt-6 text-[13px] font-medium text-black/55">Rien reçu ? Vérifiez vos spams, ou renvoyez le lien.</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isSubmitting || cooldown > 0}
                    className="inline-flex h-[46px] items-center gap-2 bg-black px-6 text-[13px] font-semibold text-white transition-colors hover:bg-[#ff7a3d] disabled:cursor-not-allowed disabled:bg-black/25"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                    {cooldown > 0 ? `Renvoyer dans ${cooldown}s` : 'Renvoyer le lien'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSentTo(null);
                      setError(null);
                    }}
                    className="inline-flex h-[46px] items-center px-6 text-[13px] font-semibold text-black ring-1 ring-black/15 transition-colors hover:bg-[#f6f5f2]"
                  >
                    Utiliser une autre adresse
                  </button>
                </div>

                <p className="mt-10 text-[13px] font-medium text-black/60">
                  Mot de passe retrouvé ?{' '}
                  <Link href="/auth/login" className="font-semibold text-black underline decoration-[#ff7a3d] decoration-2 underline-offset-4 hover:text-[#ff7a3d]">
                    Se connecter
                  </Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }}
                className="w-full max-w-[440px]"
              >
                <motion.div variants={reveal}>
                  <h1 className="font-display text-[28px] font-medium leading-[1] text-black sm:text-[34px]">
                    Mot de passe
                    <span className="block">oublié</span>
                  </h1>
                  <p className="mt-4 text-[15px] font-medium text-black/60">Entrez votre email pour recevoir un lien de réinitialisation.</p>
                </motion.div>

                <form className="mt-9 space-y-5" onSubmit={handleSubmit} noValidate>
                  <motion.div variants={reveal}>
                    <label htmlFor="forgot-email" className="mb-2 block text-[12px] font-semibold text-black">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
                      <input
                        id="forgot-email"
                        type="email"
                        autoComplete="email"
                        autoFocus
                        placeholder="votre@email.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError(null);
                        }}
                        aria-invalid={!!error}
                        aria-describedby={error ? 'forgot-error' : undefined}
                        className={cn(
                          'h-[50px] w-full bg-[#f6f5f2] pl-11 pr-4 text-[14px] font-medium text-black ring-1 transition-all duration-300 placeholder:text-black/35 focus:bg-white focus:outline-none focus:ring-2',
                          error ? 'ring-red-300 focus:ring-red-400' : 'ring-transparent hover:ring-black/15 focus:ring-[#ff7a3d]'
                        )}
                      />
                    </div>
                  </motion.div>

                  {error && (
                    <p id="forgot-error" role="alert" className="flex items-start gap-2 bg-red-50 p-3 text-[13px] font-medium text-red-600">
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
                          <span className="relative">Envoi en cours...</span>
                        </>
                      ) : (
                        <>
                          <span className="relative">Envoyer le lien</span>
                          <ArrowUpRight className="relative h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
                        </>
                      )}
                    </button>
                  </motion.div>
                </form>

                <motion.p variants={reveal} className="mt-10 text-center text-[13px] font-medium text-black/60">
                  Vous vous en souvenez ?{' '}
                  <Link href="/auth/login" className="font-semibold text-black underline decoration-[#ff7a3d] decoration-2 underline-offset-4 hover:text-[#ff7a3d]">
                    Se connecter
                  </Link>
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Visual side */}
      <div className="relative hidden flex-1 overflow-hidden bg-[#0f0f0f] lg:block">
        {/* Designed background: warm glow, dot texture, drifting dotted circles, key motif */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_12%,rgba(255,122,61,0.55),transparent_45%),radial-gradient(circle_at_10%_95%,rgba(255,122,61,0.22),transparent_40%)]" />
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.55) 1px, transparent 1.4px)', backgroundSize: '22px 22px' }}
          />

          <motion.div
            className="absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full border border-white/20"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.45) 1px, transparent 1.5px)', backgroundSize: '14px 14px' }}
            animate={{ y: [0, 18, 0], rotate: [0, 6, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute left-[12%] top-[30%] h-[180px] w-[180px] rounded-full border border-[#ff7a3d]/50"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute left-[18%] top-[36%] h-[70px] w-[70px] rounded-full bg-[#ff7a3d]"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            className="absolute right-[14%] top-[34%] text-white/[0.07]"
            initial={{ rotate: -18, opacity: 0 }}
            animate={{ rotate: -12, opacity: 1 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <KeyRound className="h-[260px] w-[260px] stroke-[1.1]" />
          </motion.div>

          {[
            { cls: 'left-[42%] top-[14%] h-5 w-5', d: 7 },
            { cls: 'left-[70%] top-[52%] h-4 w-4', d: 9 },
            { cls: 'left-[30%] top-[58%] h-3.5 w-3.5', d: 8 },
          ].map((leaf, i) => (
            <motion.span
              key={i}
              className={cn('absolute text-[#ff7a3d]', leaf.cls)}
              animate={{ y: [0, -10, 0], rotate: [0, 12, 0] }}
              transition={{ duration: leaf.d, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
            >
              <Leaf className="h-full w-full fill-current" />
            </motion.span>
          ))}

          <div className="absolute left-12 top-12 h-24 w-40 opacity-[0.08] grayscale invert xl:left-16 xl:top-16">
            <Image src="/images/logo.png" alt="" fill sizes="160px" className="object-contain object-left" />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/70 to-transparent" />
        </div>

        <div className="relative flex h-full flex-col justify-end p-12 xl:p-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
            className="max-w-[520px]"
          >
            <motion.h2 variants={reveal} className="font-display text-[44px] font-medium leading-[0.95] text-white xl:text-[54px]">
              Pas de panique,
              <span className="block">on s&apos;en occupe</span>
            </motion.h2>
            <motion.p variants={reveal} className="mt-5 text-[15px] font-medium leading-[1.6] text-white/80">
              Formations agricoles, semences certifiées et accompagnement personnalisé : retrouvez votre espace CIPRESA en quelques instants.
            </motion.p>
            <motion.ul variants={reveal} className="mt-8 grid gap-px overflow-hidden bg-white/15 ring-1 ring-white/15">
              {reassurance.map((item, i) => (
                <li
                  key={item.text}
                  className={cn('flex items-center gap-3 px-5 py-4 text-[14px] font-semibold text-white', i === 0 ? 'bg-[#ff7a3d]' : 'bg-black/40 backdrop-blur-md')}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/40">
                    <item.icon className="h-4 w-4" />
                  </span>
                  {item.text}
                </li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
