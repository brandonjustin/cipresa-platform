import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { cn } from '@/lib/utils/cn';
import { Providers } from '@/components/providers';
import { ShellContent } from '@/components/layout/shell-content';
import './globals.css';

const poppins = localFont({
  src: [
    { path: '../fonts/Poppins-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../fonts/Poppins-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../fonts/Poppins-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../fonts/Poppins-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../fonts/Poppins-ExtraBold.ttf', weight: '800', style: 'normal' },
  ],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'CIPRESA Consulting - Agriculture au Cameroun et en Afrique',
    template: '%s | CIPRESA Consulting',
  },
  description: 'Leader agricole camerounais proposant des formations en ligne, semences, matériel agricole, projets, irrigation et maintenance pour réussir dans l\'agriculture et l\'élevage en Afrique.',
  keywords: ['agriculture', 'Cameroun', 'formation agricole', 'semences', 'matériel agricole', 'CIPRESA', 'Afrique', 'agri-tech', 'e-learning'],
  authors: [{ name: 'CIPRESA Consulting' }],
  creator: 'CIPRESA Consulting',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'CIPRESA Consulting',
    title: 'CIPRESA Consulting - Agriculture au Cameroun et en Afrique',
    description: 'Formations agricoles en ligne, vente de semences et matériel agricole de qualité.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CIPRESA Consulting',
    description: 'Leader agricole camerounais - Formations, semences et matériel agricole.',
  },
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
      { url: '/icons/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0c1c33" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (['localhost', '127.0.0.1'].includes(location.hostname) && 'serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations()
                  .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
                  .then(() => window.caches ? caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key)))) : undefined)
                  .catch(() => {});
              }
            `,
          }}
        />
      </head>
      <body className={cn(poppins.variable, 'font-sans min-h-screen bg-white dark:bg-gray-950')} suppressHydrationWarning>
        <Providers>
          <ShellContent>{children}</ShellContent>
        </Providers>
      </body>
    </html>
  );
}
