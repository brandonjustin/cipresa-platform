'use client';

import { useEffect } from 'react';
import { reportError } from '@/lib/monitoring/report-error';
import './globals.css';

export default function GlobalError({
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
    <html lang="fr">
      <body>
        <main className="flex min-h-screen items-center justify-center bg-gray-950 px-4 py-16 text-white">
          <div className="w-full max-w-md text-center">
            <h1 className="mb-3 text-2xl font-bold">Erreur critique</h1>
            <p className="mb-6 text-sm text-gray-300">
              L&apos;application n&apos;a pas pu charger son interface. Réessayez après un rafraîchissement.
            </p>
            <button
              type="button"
              onClick={reset}
              className="rounded-lg bg-cipresa-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cipresa-700"
            >
              Réessayer
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
