'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Loader2, Mail, Phone, MapPin, Image as ImageIcon, Eye, EyeOff, Check, ShieldCheck, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils/cn';
import { getInitials } from '@/lib/utils/format';
import { updateMyProfile } from '@/lib/actions/profile';
import { updatePassword, fetchCurrentUser } from '@/lib/auth/actions';
import { useAuthStore } from '@/lib/store/auth-store';

interface ProfileFormState {
  fullName: string;
  email: string;
  avatar: string;
  phone: string;
  location: string;
  bio: string;
}

const BIO_MAX = 500;

const inputBase =
  'w-full bg-[#f6f5f2] text-[14px] font-medium text-black ring-1 ring-transparent transition-all duration-300 placeholder:text-black/35 hover:ring-black/15 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff7a3d]';
const labelClass = 'mb-2 block text-[12px] font-semibold text-black';

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

function isValidImageUrl(url: string) {
  if (!url.trim()) return true;
  try {
    const u = new URL(url.trim());
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

function passwordChecks(pw: string) {
  return [
    { label: '8 caractères minimum', pass: pw.length >= 8 },
    { label: 'Une majuscule', pass: /[A-Z]/.test(pw) },
    { label: 'Une minuscule', pass: /[a-z]/.test(pw) },
    { label: 'Un chiffre', pass: /\d/.test(pw) },
  ];
}

function SectionTitle({ number, icon: Icon, title, text }: { number: string; icon: typeof User; title: string; text: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="text-[26px] font-black leading-none text-[#ff7a3d]">{number}</span>
      <div>
        <h2 className="flex items-center gap-2 text-[18px] font-semibold text-black">
          <Icon className="h-4 w-4 text-black/40" />
          {title}
        </h2>
        <p className="mt-1 text-[13px] font-medium text-black/55">{text}</p>
      </div>
    </div>
  );
}

export function SettingsView({ initialProfile }: { initialProfile: ProfileFormState }) {
  const setUser = useAuthStore((s) => s.setUser);
  const [saved, setSaved] = useState(initialProfile);
  const [form, setForm] = useState(initialProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarBroken, setAvatarBroken] = useState(false);

  const [passwords, setPasswords] = useState({ next: '', confirm: '' });
  const [showPasswords, setShowPasswords] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const updateField = (field: keyof ProfileFormState, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (field === 'avatar') setAvatarBroken(false);
  };

  const isDirty = useMemo(
    () => (Object.keys(form) as (keyof ProfileFormState)[]).some((k) => form[k].trim() !== saved[k].trim()),
    [form, saved]
  );
  const nameError = !form.fullName.trim() ? 'Le nom est requis.' : undefined;
  const avatarError = !isValidImageUrl(form.avatar) ? 'Adresse invalide (doit commencer par https://).' : undefined;
  const showAvatar = form.avatar.trim() && !avatarError && !avatarBroken;

  const checks = passwordChecks(passwords.next);
  const passwordScore = checks.filter((c) => c.pass).length;
  const mismatch = passwords.confirm.length > 0 && passwords.next !== passwords.confirm;
  const canChangePassword = passwordScore >= 1 && passwords.next.length >= 8 && passwords.next === passwords.confirm;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nameError || avatarError) {
      toast.error(nameError ?? avatarError ?? 'Vérifiez le formulaire.');
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        bio: form.bio.trim(),
        avatar: form.avatar.trim(),
      };
      await updateMyProfile(payload);
      const refreshed = await fetchCurrentUser();
      setUser(refreshed);
      const next = { ...form, ...payload };
      setForm(next);
      setSaved(next);
      toast.success('Profil mis à jour !');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.next.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (passwords.next !== passwords.confirm) {
      toast.error('Les mots de passe ne correspondent pas.');
      return;
    }
    setIsChangingPassword(true);
    try {
      await updatePassword(passwords.next);
      setPasswords({ next: '', confirm: '' });
      toast.success('Mot de passe mis à jour !');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"
    >
      <div className="space-y-6">
        {/* Profile */}
        <motion.form variants={reveal} onSubmit={handleSaveProfile} noValidate className="bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:p-8">
          <SectionTitle number="01" icon={User} title="Informations personnelles" text="Ces informations apparaissent sur votre profil et vos certificats." />

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="settings-name" className={labelClass}>
                Nom complet <span className="text-[#ff7a3d]">*</span>
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
                <input
                  id="settings-name"
                  type="text"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  aria-invalid={!!nameError}
                  className={cn(inputBase, 'h-[48px] pl-11 pr-4', nameError && 'ring-red-300')}
                />
              </div>
              {nameError && <p className="mt-1.5 text-[12px] font-medium text-red-500">{nameError}</p>}
            </div>

            <div>
              <label htmlFor="settings-email" className={labelClass}>
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/30" />
                <input
                  id="settings-email"
                  type="email"
                  value={form.email}
                  disabled
                  aria-describedby="settings-email-hint"
                  className="h-[48px] w-full cursor-not-allowed bg-black/[0.04] pl-11 pr-4 text-[14px] font-medium text-black/50"
                />
              </div>
              <p id="settings-email-hint" className="mt-1.5 text-[12px] font-medium text-black/45">
                L&apos;email de connexion ne peut pas être modifié ici.
              </p>
            </div>

            <div>
              <label htmlFor="settings-phone" className={labelClass}>
                Téléphone
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
                <input
                  id="settings-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="2376XXXXXXXX"
                  className={cn(inputBase, 'h-[48px] pl-11 pr-4')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="settings-location" className={labelClass}>
                Localisation
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
                <input
                  id="settings-location"
                  type="text"
                  autoComplete="address-level2"
                  value={form.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="Yaoundé, Cameroun"
                  className={cn(inputBase, 'h-[48px] pl-11 pr-4')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="settings-avatar" className={labelClass}>
                Photo de profil (URL)
              </label>
              <div className="relative">
                <ImageIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
                <input
                  id="settings-avatar"
                  type="url"
                  inputMode="url"
                  value={form.avatar}
                  onChange={(e) => updateField('avatar', e.target.value)}
                  placeholder="https://..."
                  aria-invalid={!!avatarError}
                  className={cn(inputBase, 'h-[48px] pl-11 pr-4', avatarError && 'ring-red-300')}
                />
              </div>
              {avatarError ? (
                <p className="mt-1.5 text-[12px] font-medium text-red-500">{avatarError}</p>
              ) : avatarBroken ? (
                <p className="mt-1.5 text-[12px] font-medium text-orange-600">Impossible de charger cette image.</p>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="settings-bio" className="block text-[12px] font-semibold text-black">
                  Bio
                </label>
                <span className={cn('text-[11px] font-medium tabular-nums', form.bio.length > BIO_MAX ? 'text-red-500' : 'text-black/40')}>
                  {form.bio.length}/{BIO_MAX}
                </span>
              </div>
              <textarea
                id="settings-bio"
                value={form.bio}
                onChange={(e) => updateField('bio', e.target.value.slice(0, BIO_MAX))}
                rows={4}
                placeholder="Parlez-nous de vous..."
                className={cn(inputBase, 'resize-none px-4 py-3')}
              />
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-6">
            <button
              type="submit"
              disabled={isSaving || !isDirty}
              className="inline-flex h-[46px] items-center justify-center gap-2 bg-[#ff7a3d] px-7 text-[13px] font-semibold text-white transition-colors duration-300 hover:bg-black disabled:cursor-not-allowed disabled:bg-black/15 disabled:text-black/40"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            {isDirty && !isSaving && (
              <button
                type="button"
                onClick={() => {
                  setForm(saved);
                  setAvatarBroken(false);
                }}
                className="inline-flex h-[46px] items-center gap-2 px-5 text-[13px] font-semibold text-black ring-1 ring-black/15 transition-colors hover:bg-[#f6f5f2]"
              >
                <RotateCcw className="h-4 w-4" />
                Annuler
              </button>
            )}
            <span className="text-[12px] font-medium text-black/45">{isDirty ? 'Modifications non enregistrées' : 'Tout est à jour'}</span>
          </div>
        </motion.form>

        {/* Password */}
        <motion.form variants={reveal} onSubmit={handleChangePassword} noValidate className="bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <SectionTitle number="02" icon={Lock} title="Changer le mot de passe" text="Utilisez un mot de passe que vous n'utilisez nulle part ailleurs." />
            <button
              type="button"
              onClick={() => setShowPasswords((v) => !v)}
              aria-label={showPasswords ? 'Masquer les mots de passe' : 'Afficher les mots de passe'}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-black/50 ring-1 ring-black/10 transition-colors hover:bg-black hover:text-white"
            >
              {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="settings-new-password" className={labelClass}>
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
                <input
                  id="settings-new-password"
                  type={showPasswords ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={passwords.next}
                  onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
                  placeholder="••••••••"
                  aria-describedby="settings-password-rules"
                  className={cn(inputBase, 'h-[48px] pl-11 pr-4')}
                />
              </div>
            </div>
            <div>
              <label htmlFor="settings-confirm-password" className={labelClass}>
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
                <input
                  id="settings-confirm-password"
                  type={showPasswords ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                  placeholder="••••••••"
                  aria-invalid={mismatch}
                  className={cn(inputBase, 'h-[48px] pl-11 pr-4', mismatch && 'ring-red-300')}
                />
              </div>
              {mismatch && <p className="mt-1.5 text-[12px] font-medium text-red-500">Les mots de passe ne correspondent pas.</p>}
              {!mismatch && passwords.confirm && passwords.next === passwords.confirm && (
                <p className="mt-1.5 flex items-center gap-1 text-[12px] font-medium text-emerald-600">
                  <Check className="h-3.5 w-3.5" /> Les mots de passe correspondent.
                </p>
              )}
            </div>
          </div>

          <ul id="settings-password-rules" className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5 sm:grid-cols-4">
            {checks.map((c) => (
              <li key={c.label} className={cn('flex items-center gap-1.5 text-[12px] font-medium transition-colors', c.pass ? 'text-black' : 'text-black/40')}>
                <span className={cn('flex h-3.5 w-3.5 items-center justify-center rounded-full', c.pass ? 'bg-emerald-500 text-white' : 'ring-1 ring-black/20')}>
                  {c.pass && <Check className="h-2.5 w-2.5" />}
                </span>
                {c.label}
              </li>
            ))}
          </ul>

          <div className="mt-7 border-t border-gray-200 pt-6">
            <button
              type="submit"
              disabled={isChangingPassword || !canChangePassword}
              className="inline-flex h-[46px] items-center justify-center gap-2 bg-black px-7 text-[13px] font-semibold text-white transition-colors duration-300 hover:bg-[#ff7a3d] disabled:cursor-not-allowed disabled:bg-black/15 disabled:text-black/40"
            >
              {isChangingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              {isChangingPassword ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
            </button>
          </div>
        </motion.form>
      </div>

      {/* Live profile preview */}
      <motion.aside variants={reveal} className="xl:sticky xl:top-24 xl:self-start">
        <div className="overflow-hidden bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
          <div className="relative h-24 overflow-hidden bg-[#ff7a3d]">
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-16 h-[160px] w-[160px] rounded-full border border-white/35 opacity-70"
              style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '10px 10px' }}
            />
          </div>
          <div className="px-6 pb-6">
            <div className="relative z-10 -mt-10 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-black text-[22px] font-bold text-white ring-4 ring-white">
              {showAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.avatar.trim()} alt="" className="h-full w-full object-cover" onError={() => setAvatarBroken(true)} />
              ) : (
                getInitials(form.fullName || 'Utilisateur')
              )}
            </div>
            <p className="mt-4 text-[17px] font-semibold leading-tight text-black">{form.fullName.trim() || 'Votre nom'}</p>
            <p className="mt-1 text-[12px] font-medium text-black/50">{form.email}</p>
            {(form.location.trim() || form.phone.trim()) && (
              <div className="mt-4 space-y-1.5 text-[12px] font-medium text-black/65">
                {form.location.trim() && (
                  <p className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-[#ff7a3d]" /> {form.location.trim()}
                  </p>
                )}
                {form.phone.trim() && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-[#ff7a3d]" /> {form.phone.trim()}
                  </p>
                )}
              </div>
            )}
            <div className="mt-5 border-t border-gray-200 pt-4">
              <p className="text-[12px] font-semibold text-black/50">Aperçu du profil</p>
              <p className="mt-2 text-[13px] font-medium leading-[1.55] text-black/70">
                {form.bio.trim() || 'Ajoutez une bio pour vous présenter à la communauté.'}
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </motion.div>
  );
}
