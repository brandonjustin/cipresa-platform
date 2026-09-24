'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowRight, Eye, EyeOff, Leaf, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updatePassword } from '@/lib/auth/actions';

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await updatePassword(password);
      toast.success('Mot de passe mis à jour !');
      // Hard navigation — see the login page for why: /dashboard is a
      // protected route and router.push() can replay a stale pre-session
      // cached redirect instead of re-checking with the now-valid session.
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Le lien a peut-être expiré, demandez-en un nouveau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2.5 mb-10">
            <Image src="/images/logo.png" alt="CIPRESA Consulting" width={150} height={60} className="h-12 w-auto object-contain" priority />
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Nouveau mot de passe</h1>
          <p className="text-gray-500 mb-8">Choisissez un nouveau mot de passe pour votre compte.</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <Input label="Nouveau mot de passe" type={showPassword ? 'text' : 'password'} placeholder="Minimum 8 caractères" icon={Lock}
                value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Input label="Confirmer le mot de passe" type={showPassword ? 'text' : 'password'} placeholder="Répétez le mot de passe" icon={Lock}
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" fullWidth size="lg" icon={ArrowRight} iconPosition="right" loading={isSubmitting}>
              Mettre à jour le mot de passe
            </Button>
          </form>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-cipresa-900 to-gray-950 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.05]" />
        <div className="relative text-center max-w-md">
          <Leaf className="w-20 h-20 text-cipresa-400/40 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">CIPRESA</h2>
          <p className="text-white/60">Formations agricoles, semences certifiées et accompagnement personnalisé.</p>
        </div>
      </div>
    </div>
  );
}
