'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Scroll direction + "at top" flag for the header.
 *
 * Only re-renders when one of those two values actually changes (not on every
 * scroll event), and reads the position once per animation frame. Tracking the
 * raw scrollY in state re-rendered the whole navbar dozens of times per second
 * while scrolling, which made scrolling and navigation feel heavy.
 */
export function useScroll() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [isAtTop, setIsAtTop] = useState(true);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;
    setIsAtTop(window.scrollY <= 0);

    const update = () => {
      ticking.current = false;
      const y = window.scrollY;
      // Ignore tiny jitters (trackpads, iOS bounce) so the header doesn't flicker.
      if (Math.abs(y - lastY.current) > 4) {
        const dir = y > lastY.current ? 'down' : 'up';
        setScrollDirection((prev) => (prev === dir ? prev : dir));
        lastY.current = y;
      }
      const top = y <= 0;
      setIsAtTop((prev) => (prev === top ? prev : top));
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { scrollDirection, isAtTop };
}
