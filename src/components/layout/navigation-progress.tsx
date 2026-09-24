'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Thin orange bar at the top of the viewport that starts the instant an
 * internal link is clicked and completes when the new route has rendered.
 * Gives immediate feedback on every navigation, instead of the page looking
 * frozen while a dynamic route's server data loads.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [state, setState] = useState<'idle' | 'running' | 'done'>('idle');
  const doneTimer = useRef<ReturnType<typeof setTimeout>>();
  const safetyTimer = useRef<ReturnType<typeof setTimeout>>();

  // Start on internal link clicks.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest('a');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // Same page (only hash or query change): Next doesn't swap the route tree.
      if (url.pathname === window.location.pathname) return;

      clearTimeout(doneTimer.current);
      clearTimeout(safetyTimer.current);
      setState('running');
      // Never leave the bar stuck if a navigation is cancelled.
      safetyTimer.current = setTimeout(() => setState('idle'), 12000);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // Complete when the route actually changed.
  useEffect(() => {
    setState((prev) => {
      if (prev !== 'running') return prev;
      clearTimeout(safetyTimer.current);
      doneTimer.current = setTimeout(() => setState('idle'), 350);
      return 'done';
    });
  }, [pathname]);

  useEffect(
    () => () => {
      clearTimeout(doneTimer.current);
      clearTimeout(safetyTimer.current);
    },
    []
  );

  if (state === 'idle') return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]">
      <div
        className={
          state === 'running'
            ? 'nav-progress-running h-full origin-left bg-[#ff7a3d] shadow-[0_0_10px_rgba(255,122,61,0.7)]'
            : 'h-full origin-left scale-x-100 bg-[#ff7a3d] opacity-0 transition-[transform,opacity] duration-300'
        }
      />
    </div>
  );
}
