/**
 * Loading placeholders rendered by loading.tsx boundaries while a route's
 * server data resolves. They mirror the real page layout (beige header band,
 * tiles, cards) so navigation feels continuous instead of flashing a blank
 * screen with a spinner. Pure markup + CSS, no JavaScript needed.
 */

function Block({ className }: { className: string }) {
  return <div className={`animate-pulse bg-black/[0.06] ${className}`} />;
}

/** Public pages: beige header band + a row of cards. */
export function MarketingPageSkeleton() {
  return (
    <div className="pt-[60px]" aria-busy="true" aria-label="Chargement">
      <div className="bg-[#f6f5f2]">
        <div className="mx-auto max-w-[1520px] px-6 pb-16 pt-12 sm:px-10 lg:px-14">
          <Block className="h-6 w-28" />
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="space-y-3">
              <Block className="h-12 w-[70%] max-w-[560px]" />
              <Block className="h-12 w-[45%] max-w-[360px]" />
            </div>
            <div className="w-full max-w-[420px] space-y-2.5">
              <Block className="h-4 w-full" />
              <Block className="h-4 w-4/5" />
              <Block className="mt-4 h-[42px] w-40" />
            </div>
          </div>
          <div className="mt-12 grid gap-px md:grid-cols-3">
            <div className="h-[150px] animate-pulse bg-[#ff7a3d]/25" />
            <Block className="h-[150px]" />
            <Block className="h-[150px]" />
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-[1520px] gap-5 px-6 py-16 sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:px-14">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="ring-1 ring-gray-100">
            <Block className="h-48" />
            <div className="space-y-2.5 p-5">
              <Block className="h-3 w-1/3" />
              <Block className="h-4 w-4/5" />
              <Block className="h-4 w-3/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Dashboard/admin content area (the shell with sidebar stays mounted around it). */
export function DashboardContentSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Chargement">
      <div className="grid grid-cols-2 gap-px lg:grid-cols-4">
        <div className="h-[132px] animate-pulse bg-[#ff7a3d]/25" />
        <Block className="h-[132px]" />
        <Block className="h-[132px]" />
        <Block className="h-[132px]" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="space-y-4 bg-white p-6">
            <Block className="h-6 w-1/2" />
            {[0, 1, 2].map((j) => (
              <div key={j} className="flex items-center gap-4">
                <Block className="h-12 w-16" />
                <div className="flex-1 space-y-2">
                  <Block className="h-3.5 w-3/4" />
                  <Block className="h-2 w-full" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Backwards-compatible generic loader (centered, compact). */
export function PageLoader({ className = 'min-h-[60vh]' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`} aria-busy="true" aria-label="Chargement">
      <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#ff7a3d]/20 border-t-[#ff7a3d]" />
    </div>
  );
}
