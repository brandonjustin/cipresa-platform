'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Maximize, Minimize, ChevronLeft, ChevronRight, CheckCircle, Circle, Clock,
  FileText, ArrowLeft, BookOpen, BarChart3, Menu, X, VideoOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';
import { useProgressStore } from '@/lib/store/progress-store';
import { toggleLessonProgress } from '@/lib/actions/courses';
import type { Course, Section } from '@/types';
import { BgImage } from '@/components/ui/bg-image';

interface CoursePlayerViewProps {
  course: Course;
  sections: Section[];
  completedLessonIds: string[];
  initialLessonId?: string;
}

export function CoursePlayerView({ course, sections, completedLessonIds, initialLessonId }: CoursePlayerViewProps) {
  const router = useRouter();
  const allLessons = sections.flatMap((s) => s.lessons);
  const [currentLessonId, setCurrentLessonId] = useState(
    (initialLessonId && allLessons.some((l) => l.id === initialLessonId) ? initialLessonId : allLessons[0]?.id) ?? ''
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTogglingProgress, setIsTogglingProgress] = useState(false);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const hydrate = useProgressStore((s) => s.hydrate);
  const isCompleted = useProgressStore((s) => s.isCompleted);
  const setCompleted = useProgressStore((s) => s.setCompleted);
  const completedCount = useProgressStore((s) => s.getCompletedCount(course.id));

  useEffect(() => {
    hydrate(course.id, completedLessonIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.id]);

  const currentLesson = allLessons.find((l) => l.id === currentLessonId) || allLessons[0];
  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const progressPct = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;
  const isCurrentCompleted = currentLesson ? isCompleted(course.id, currentLesson.id) : false;

  const handleLessonChange = useCallback((lessonId: string) => {
    setCurrentLessonId(lessonId);
    router.replace(`/course/${course.slug}/learn?lesson=${lessonId}`, { scroll: false });
  }, [course.slug, router]);

  const toggleFullscreen = useCallback(async () => {
    const el = playerContainerRef.current;
    if (!document.fullscreenElement) {
      await el?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const toggleCurrentLesson = useCallback(async () => {
    if (!currentLesson || isTogglingProgress) return;
    const nextState = !isCurrentCompleted;
    setCompleted(course.id, currentLesson.id, nextState);
    setIsTogglingProgress(true);
    try {
      await toggleLessonProgress(course.id, currentLesson.id, nextState);
    } catch (err) {
      setCompleted(course.id, currentLesson.id, !nextState);
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setIsTogglingProgress(false);
    }
  }, [course.id, currentLesson, isCurrentCompleted, isTogglingProgress, setCompleted]);

  if (!currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2 text-white">Ce cours n&apos;a pas encore de contenu</h1>
          <Link href={`/course/${course.slug}`}><Button>Retour au cours</Button></Link>
        </div>
      </div>
    );
  }

  const sidebar = (onSelect?: () => void) => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cipresa-400" /> Contenu du cours
          </h3>
          <span className="text-xs text-gray-500">{completedCount}/{allLessons.length}</span>
        </div>
        <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
          <div className="h-full rounded-full bg-cipresa-500 transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.id}>
            <div className="px-4 py-2.5 bg-gray-900 border-b border-gray-800">
              <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">{section.title}</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">{section.lessons.length} leçons</p>
            </div>
            {section.lessons.map((lesson) => {
              const isActive = lesson.id === currentLessonId;
              const done = isCompleted(course.id, lesson.id);
              return (
                <button
                  key={lesson.id}
                  onClick={() => { handleLessonChange(lesson.id); onSelect?.(); }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-gray-800/50',
                    isActive ? 'bg-cipresa-500/10 border-l-2 border-l-cipresa-500' : 'hover:bg-gray-800/50 border-l-2 border-l-transparent'
                  )}
                >
                  {done ? <CheckCircle className="w-4 h-4 text-cipresa-400 flex-shrink-0" /> : <Circle className="w-4 h-4 text-gray-600 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm truncate', isActive ? 'text-white font-medium' : 'text-gray-400')}>
                      {lesson.title}
                    </p>
                    <span className="text-[10px] text-gray-600 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {lesson.videoDuration}
                      {done && <span className="text-cipresa-400 ml-1">• Terminé</span>}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-800 flex-shrink-0 bg-gray-900/80 backdrop-blur">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
            <BgImage src={course.thumbnail} className="w-full h-full" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{course.title}</p>
            <p className="text-xs text-gray-500">{course.instructor.fullName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>{progressPct}% terminé</span>
          <span className="text-gray-700">•</span>
          <FileText className="w-3.5 h-3.5" />
          <span>{completedCount}/{allLessons.length} leçons</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-950 overflow-hidden">
      <header className="flex items-center justify-between px-4 h-14 bg-gray-900 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link href={`/course/${course.slug}`} className="p-2 rounded-lg hover:bg-gray-800 transition-colors" title="Retour au cours">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div className="h-5 w-px bg-gray-800" />
          <h1 className="text-sm font-medium text-white truncate max-w-[200px] sm:max-w-md">{course.title}</h1>
          <Badge variant="success" size="sm" className="hidden sm:inline-flex">{progressPct}%</Badge>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors lg:hidden"
            title={sidebarOpen ? 'Masquer le menu' : 'Afficher le menu'}
          >
            {sidebarOpen ? <X className="w-5 h-5 text-gray-400" /> : <Menu className="w-5 h-5 text-gray-400" />}
          </button>
          <Link href={`/course/${course.slug}`}>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">Quitter</Button>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <div ref={playerContainerRef} className="relative bg-black flex-1 flex items-center justify-center">
            {currentLesson.videoUrl ? (
              <video
                key={currentLesson.id}
                src={currentLesson.videoUrl}
                poster={course.thumbnail}
                controls
                className="absolute inset-0 w-full h-full"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <BgImage src={course.thumbnail} className="absolute inset-0 opacity-20" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                <div className="relative z-10">
                  <VideoOff className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-white font-medium mb-1">Vidéo bientôt disponible</p>
                  <p className="text-gray-400 text-sm">Cette leçon sera mise en ligne prochainement.</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-900 border-t border-gray-800 px-6 py-4 flex-shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold text-white">{currentLesson.title}</h2>
                  {isCurrentCompleted && <CheckCircle className="w-4 h-4 text-cipresa-400 flex-shrink-0" />}
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">{currentLesson.description || 'Aucune description disponible.'}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={toggleCurrentLesson}
                  disabled={isTogglingProgress}
                  className={cn(
                    'p-2 rounded-lg transition-colors disabled:opacity-50',
                    isCurrentCompleted ? 'text-cipresa-400 hover:bg-cipresa-500/20' : 'text-gray-400 hover:bg-gray-800'
                  )}
                  title={isCurrentCompleted ? 'Marquer comme non terminé' : 'Marquer comme terminé'}
                >
                  {isCurrentCompleted ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
                  title="Plein écran"
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>

                {prevLesson && (
                  <button
                    onClick={() => handleLessonChange(prevLesson.id)}
                    className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
                    title={prevLesson.title}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                {nextLesson && (
                  <button
                    onClick={() => handleLessonChange(nextLesson.id)}
                    className="p-2 rounded-lg bg-cipresa-600 hover:bg-cipresa-500 transition-colors text-white flex items-center gap-1.5 px-3"
                  >
                    <span className="text-sm font-medium hidden sm:inline">Suivant</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, minWidth: 0 }}
              animate={{ width: 320, minWidth: 320 }}
              exit={{ width: 0, minWidth: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="hidden lg:flex bg-gray-900 border-l border-gray-800 overflow-hidden flex-shrink-0"
            >
              {sidebar()}
            </motion.aside>
          )}
        </AnimatePresence>

        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-30">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-gray-900 border-l border-gray-800 overflow-hidden">
              {sidebar(() => setSidebarOpen(false))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
