'use client';

import { cn } from '@/lib/utils/cn';
import { BgImage } from '@/components/ui/bg-image';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  as?: 'div' | 'article';
}

export const Card: React.FC<CardProps> = ({ children, className, hover = true, glass = false, as = 'div' }) => {
  const Component = as === 'article' ? 'article' : 'div';

  return (
    <Component className={cn(
      'overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-700/50 dark:bg-gray-800/80',
      hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-md',
      glass && 'glass-card',
      className
    )}>
      {children}
    </Component>
  );
};

export const CardImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  aspect?: 'video' | 'square' | 'portrait';
}> = ({ src, alt, className, aspect = 'video' }) => {
  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
  };

  return (
    <div className={cn('relative overflow-hidden bg-gray-100 dark:bg-gray-800', aspectClasses[aspect], className)}>
      <BgImage
        src={src}
        alt={alt}
        className="h-full w-full transition-transform duration-500 group-hover:scale-110"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn('p-4', className)}>
    {children}
  </div>
);

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700', className)} />
);
