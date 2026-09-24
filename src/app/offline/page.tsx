'use client';

import Link from 'next/link';
import { WifiOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-gray-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Vous êtes hors ligne</h1>
        <p className="text-gray-500 mb-8">
          Vérifiez votre connexion internet et réessayez. Les pages déjà visitées sont disponibles en cache.
        </p>
        <Link href="/">
          <Button icon={ArrowLeft} iconPosition="left">Retour à l'accueil</Button>
        </Link>
      </div>
    </div>
  );
}
