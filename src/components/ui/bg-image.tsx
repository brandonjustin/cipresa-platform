import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

// Hosts allowed in next.config.js `images.remotePatterns`: only these can go
// through the Next.js optimizer. Anything else is served as-is (unoptimized)
// rather than crashing the render with an "unconfigured host" error.
const OPTIMIZABLE_HOSTS = [/(^|\.)cipresaconsulting\.com$/, /^images\.unsplash\.com$/, /^res\.cloudinary\.com$/, /\.supabase\.co$/];

function canOptimize(src: string) {
  if (src.startsWith('/')) return true;
  try {
    const { protocol, hostname } = new URL(src);
    return protocol === 'https:' && OPTIMIZABLE_HOSTS.some((re) => re.test(hostname));
  } catch {
    return false;
  }
}

/**
 * Drop-in replacement for `<div className="bg-cover bg-center" style={{ backgroundImage }} />`.
 *
 * CSS background images always download the full original file (often
 * 400 KB–3 MB here), even for a 64px thumbnail. This renders a `next/image`
 * instead, so each visitor gets a resized, AVIF/WebP-compressed, lazy-loaded
 * version matching `sizes`. Layout/positioning classes still go in
 * `className` exactly as before; the wrapper keeps an empty box when `src` is
 * missing, so placeholders behave like the old background.
 */
export function BgImage({
  src,
  alt = '',
  className,
  sizes = '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw',
  priority = false,
  objectPosition,
  role,
  'aria-label': ariaLabel,
}: {
  src?: string | null;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  objectPosition?: string;
  role?: string;
  'aria-label'?: string;
}) {
  const url = src?.trim();
  return (
    <div className={cn('relative overflow-hidden', className)} role={role} aria-label={ariaLabel}>
      {url ? (
        <Image
          src={url}
          alt={alt || ariaLabel || ''}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={!canOptimize(url)}
          className="object-cover"
          style={objectPosition ? { objectPosition } : undefined}
        />
      ) : null}
    </div>
  );
}
