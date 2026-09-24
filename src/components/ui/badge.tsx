import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'premium';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  success: 'bg-cipresa-100 text-cipresa-800 dark:bg-cipresa-900/50 dark:text-cipresa-300',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
  error: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  premium: 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 dark:from-amber-900/50 dark:to-yellow-900/50 dark:text-amber-300',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', size = 'md', className }) => (
  <span className={cn('inline-flex items-center font-medium rounded-full', variantStyles[variant], sizes[size], className)}>
    {children}
  </span>
);
