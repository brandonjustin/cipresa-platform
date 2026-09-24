'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface CursorTrailCanvasProps {
  className?: string;
  color?: string;
  children?: ReactNode;
}

const POINTS_NUMBER = 40;
const WIDTH_FACTOR = 0.3;
const SPRING = 0.4;
const FRICTION = 0.5;

/** Scoped version of the "satisfying cursor" trail effect (spring-chained
 * points drawn as a tapering quadratic-curve ribbon) — tracks the pointer
 * only within this component's own bounds instead of the whole page, and
 * idles into a slow figure-eight drift before the user first interacts. */
export function CursorTrailCanvas({ className, color = '#F6B13D', children }: CursorTrailCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let mouseMoved = false;
    let width = container.clientWidth;
    let height = container.clientHeight;

    const pointer = { x: width / 2, y: height / 2 };
    const trail = Array.from({ length: POINTS_NUMBER }, () => ({ x: pointer.x, y: pointer.y, dx: 0, dy: 0 }));

    const setupCanvas = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const updatePointer = (clientX: number, clientY: number) => {
      mouseMoved = true;
      const rect = container.getBoundingClientRect();
      pointer.x = clientX - rect.left;
      pointer.y = clientY - rect.top;
    };

    const handleMouseMove = (e: MouseEvent) => updatePointer(e.clientX, e.clientY);
    const handleClick = (e: MouseEvent) => updatePointer(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.targetTouches[0];
      if (touch) updatePointer(touch.clientX, touch.clientY);
    };

    setupCanvas();
    const resizeObserver = new ResizeObserver(setupCanvas);
    resizeObserver.observe(container);

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    let rafId = 0;

    const update = (t: number) => {
      if (!mouseMoved) {
        pointer.x = (0.5 + 0.3 * Math.cos(0.002 * t) * Math.sin(0.005 * t)) * width;
        pointer.y = (0.5 + 0.2 * Math.cos(0.005 * t) + 0.1 * Math.cos(0.01 * t)) * height;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      trail.forEach((p, pIdx) => {
        const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
        const spring = pIdx === 0 ? 0.4 * SPRING : SPRING;
        p.dx += (prev.x - p.x) * spring;
        p.dy += (prev.y - p.y) * spring;
        p.dx *= FRICTION;
        p.dy *= FRICTION;
        p.x += p.dx;
        p.y += p.dy;
      });

      ctx.lineCap = 'round';
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);

      for (let i = 1; i < trail.length - 1; i++) {
        const xc = 0.5 * (trail[i].x + trail[i + 1].x);
        const yc = 0.5 * (trail[i].y + trail[i + 1].y);
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        ctx.lineWidth = WIDTH_FACTOR * (POINTS_NUMBER - i);
        ctx.stroke();
      }
      ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
      ctx.stroke();

      rafId = window.requestAnimationFrame(update);
    };

    rafId = window.requestAnimationFrame(update);

    return () => {
      window.cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [color]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0 h-full w-full" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
