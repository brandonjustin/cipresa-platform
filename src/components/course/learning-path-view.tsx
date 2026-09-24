'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowRight, BookOpen, CheckCircle, ChevronLeft, Lock, Milestone, PlayCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageTransition, AnimatedSection } from '@/components/animations/motion-components';
import { formatCurrency } from '@/lib/utils/format';
import { startLearningPath } from '@/lib/actions/courses';
import type { LearningPath } from '@/types';
import { BgImage } from '@/components/ui/bg-image';

const levelLabels: Record<string, string> = { beginner: 'Débutant', intermediate: 'Intermédiaire', advanced: 'Avancé', all: 'Tous niveaux' };

interface LearningPathViewProps {
  path: LearningPath;
  isAuthenticated: boolean;
  isOnPath: boolean;
  entitledCourseIds: string[];
}

export function LearningPathView({ path, isAuthenticated, isOnPath, entitledCourseIds }: LearningPathViewProps) {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const [started, setStarted] = useState(isOnPath);

  const completedCount = path.courses.filter((c) => entitledCourseIds.includes(c.course.id)).length;
  const progressPct = path.courses.length > 0 ? Math.round((completedCount / path.courses.length) * 100) : 0;

  const handleStart = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?next=/paths/${path.slug}`);
      return;
    }
    setStarting(true);
    try {
      await startLearningPath(path.id);
      setStarted(true);
      toast.success('Parcours démarré !');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setStarting(false);
    }
  };

  return (
    <PageTransition>
      <div className="pt-16">
        <div className="bg-gradient-to-b from-gray-950 to-gray-900 py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/paths" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-6">
              <ChevronLeft className="w-4 h-4" /> Retour aux parcours
            </Link>
            <AnimatedSection>
              <div className="flex items-center gap-2 mb-3">
                <Milestone className="w-5 h-5 text-cipresa-400" />
                <Badge variant="info">{levelLabels[path.level]}</Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{path.title}</h1>
              <p className="text-white/70 text-lg mb-6 max-w-2xl">{path.description}</p>
              <div className="flex items-center gap-4 text-sm text-white/60 mb-6">
                <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {path.courses.length} cours</span>
              </div>

              {started ? (
                <div className="max-w-sm">
                  <div className="flex items-center justify-between text-sm text-white/70 mb-1.5">
                    <span>Progression du parcours</span>
                    <span className="font-semibold">{progressPct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-cipresa-500 transition-all duration-500" style={{ width: `${progressPct}%` }} />
                  </div>
                </div>
              ) : (
                <Button size="lg" onClick={handleStart} loading={starting}>
                  Démarrer ce parcours <ArrowRight className="w-5 h-5" />
                </Button>
              )}
            </AnimatedSection>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Cours du parcours</h2>
          <div className="space-y-3">
            {path.courses.map(({ course, isRequired }, idx) => {
              const owned = entitledCourseIds.includes(course.id);
              return (
                <Link
                  key={course.id}
                  href={`/course/${course.slug}`}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-cipresa-200 dark:hover:border-cipresa-800 hover:bg-cipresa-50/50 dark:hover:bg-cipresa-950/20 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-bold text-gray-500 flex-shrink-0">
                    {owned ? <CheckCircle className="w-5 h-5 text-cipresa-500" /> : idx + 1}
                  </div>
                  <BgImage src={course.thumbnail} className="w-16 h-11 rounded-lg flex-shrink-0 hidden sm:block" sizes="160px" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate group-hover:text-cipresa-600 transition-colors">{course.title}</p>
                    <p className="text-xs text-gray-500">{course.instructor.fullName} · {course.duration}{!isRequired && ' · Optionnel'}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {owned ? (
                      <PlayCircle className="w-5 h-5 text-cipresa-500" />
                    ) : course.price === 0 ? (
                      <span className="text-sm font-semibold text-cipresa-600">Gratuit</span>
                    ) : (
                      <span className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <Lock className="w-3.5 h-3.5" /> {formatCurrency(course.price, course.currency)}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
