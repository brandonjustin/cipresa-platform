'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageTransition, AnimatedSection } from '@/components/animations/motion-components';

export default function NotFound() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-dot opacity-[0.03]" />
        <div className="relative w-full max-w-lg text-center">
          <AnimatedSection direction="scale">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cipresa-500 to-blue-600 shadow-lg shadow-cipresa-500/20"
            >
              <Search className="h-9 w-9 text-white" />
            </motion.div>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-3 text-sm font-semibold uppercase tracking-widest text-cipresa-600 dark:text-cipresa-400"
            >
              404
            </motion.p>
            <h1 className="mb-4 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Page introuvable
            </h1>
            <p className="mb-8 text-base text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
              Cette page n&apos;existe pas ou a été déplacée.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Link href="/">
                <Button icon={Home} size="lg">
                  Retour à l&apos;accueil
                </Button>
              </Link>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection delay={0.45}>
            <div className="mt-12 flex items-center justify-center gap-6 text-xs text-gray-400 dark:text-gray-600">
              <Link href="/courses" className="hover:text-cipresa-500 transition-colors">Formations</Link>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
              <Link href="/marketplace" className="hover:text-cipresa-500 transition-colors">Boutique</Link>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
              <Link href="/contact" className="hover:text-cipresa-500 transition-colors">Contact</Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </PageTransition>
  );
}
