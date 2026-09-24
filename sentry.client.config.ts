import * as Sentry from '@sentry/nextjs';

// No-ops cleanly when NEXT_PUBLIC_SENTRY_DSN is unset (e.g. before that
// account exists) — Sentry.init tolerates an empty dsn.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
});
