'use client';

import { motion, type Variants } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0 },
};

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } },
};

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  duration?: number;
  once?: boolean;
}

export const AnimatedSection = forwardRef<HTMLDivElement, AnimatedSectionProps>(
  ({ children, className, delay = 0, direction = 'up', duration = 0.5, once = true }, ref) => {
    const variants = {
      up: fadeInUp,
      down: fadeInDown,
      left: fadeInLeft,
      right: fadeInRight,
      scale: scaleIn,
    };

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: '-50px' }}
        variants={variants[direction]}
        transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }
);
AnimatedSection.displayName = 'AnimatedSection';

export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className, delay = 0 }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-50px' }}
    variants={staggerContainer}
    transition={{ delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <motion.div variants={fadeInUp} className={className}>
    {children}
  </motion.div>
);

export const AnimatedCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  whileHoverScale?: boolean;
}> = ({ children, className, whileHoverScale = true }) => (
  <motion.div
    initial="rest"
    whileHover="hover"
    animate="rest"
    className={cn('card-shine', className)}
    variants={whileHoverScale ? cardHover : {}}
  >
    {children}
  </motion.div>
);

export const FadeIn: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

export const SlideUp: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const ScaleIn: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/** Page entrance fade. CSS-only (see `.page-enter` in globals.css): it plays on
 * first paint from the server HTML, instead of a framer-motion `initial` that
 * rendered pages at opacity 0 until JavaScript had downloaded and hydrated. */
export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="page-enter">{children}</div>
);

export const CounterAnimation: React.FC<{
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}> = ({ value, suffix = '', duration = 2, className }) => {
  return (
    <span className={className}>
      {value}{suffix}
    </span>
  );
};
