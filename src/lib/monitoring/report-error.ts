/**
 * Reports an error to Sentry only when a DSN is configured, loading the SDK
 * on demand. Keeps @sentry/nextjs out of every page's bundle: the root error
 * boundaries are part of every route, so a static import there shipped the
 * whole SDK to all visitors.
 *
 * NEXT_PUBLIC_SENTRY_DSN is inlined at build time, so without a DSN the
 * import() below is dead code and the bundler drops the SDK entirely.
 */
export function reportError(error: unknown) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    import('@sentry/nextjs')
      .then((Sentry) => Sentry.captureException(error))
      .catch(() => {});
  }
}
