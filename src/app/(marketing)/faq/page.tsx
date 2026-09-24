'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PageTransition, AnimatedSection } from '@/components/animations/motion-components';
import { faqItems } from '@/lib/utils/data';
import { cn } from '@/lib/utils/cn';

export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = faqItems.filter(f =>
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(faqItems.map(f => f.category)));

  return (
    <PageTransition>
      <div className="pt-20">
        <div className="bg-gradient-to-b from-cipresa-950 to-gray-950 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center">
              <Badge variant="success" className="mb-4">FAQ</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Questions fréquentes</h1>
              <p className="text-white/60 max-w-2xl mx-auto mb-8">Trouvez rapidement des réponses à vos questions</p>
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Rechercher..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cipresa-500 backdrop-blur-sm" />
              </div>
            </AnimatedSection>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-4">
            {filtered.map((faq) => (
              <div key={faq.id} className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="default" size="sm">{faq.category}</Badge>
                    <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                  </div>
                  <ChevronDown className={cn('w-5 h-5 text-gray-400 flex-shrink-0 transition-transform', openId === faq.id && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-2 text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-800">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
