'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  as?: 'button' | 'a';
  href?: string;
}

const variants = {
  primary: 'bg-cipresa-600 text-white hover:bg-cipresa-700 shadow-button hover:shadow-button-hover',
  secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm',
  outline: 'border border-cipresa-500 text-cipresa-600 dark:text-cipresa-400 hover:bg-cipresa-50 dark:hover:bg-cipresa-950',
  ghost: 'text-cipresa-600 dark:text-cipresa-400 hover:bg-cipresa-50 dark:hover:bg-cipresa-950/50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-xl',
  xl: 'px-8 py-4 text-lg rounded-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, icon: Icon, iconPosition = 'left', fullWidth, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex min-h-10 items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cipresa-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 dark:focus:ring-offset-gray-900',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...(props as any)}
      >
        {loading && (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {!loading && Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
        {children}
        {!loading && Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
      </button>
    );
  }
);
Button.displayName = 'Button';
