'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { reportError } from '@/lib/monitoring/report-error';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-16 dark:bg-gray-950">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">Une erreur est survenue</h1>
        <p className="mb-6 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          La page n&apos;a pas pu se charger correctement. Vous pouvez réessayer ou revenir à l&apos;accueil.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button type="button" onClick={reset} icon={RefreshCw}>
            Réessayer
          </Button>
          <Link href="/">
            <Button type="button" variant="outline">
              Accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
