import { create } from 'zustand';

/**
 * Optimistic client-side cache of lesson completion, seeded from server
 * data (see getCompletedLessonIds in lib/data/courses.ts) and updated
 * immediately on click for instant feedback while toggleLessonProgress
 * (a server action) persists the real change to `lesson_progress`. Not
 * persisted to localStorage — the database is the source of truth, and
 * every page that needs this data hydrates it fresh from props on load.
 */
interface ProgressState {
  completedByCourse: Record<string, Set<string>>;
  hydrate: (courseId: string, completedLessonIds: string[]) => void;
  setCompleted: (courseId: string, lessonId: string, completed: boolean) => void;
  isCompleted: (courseId: string, lessonId: string) => boolean;
  getCompletedCount: (courseId: string) => number;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  completedByCourse: {},
  hydrate: (courseId, completedLessonIds) =>
    set((state) => ({
      completedByCourse: { ...state.completedByCourse, [courseId]: new Set(completedLessonIds) },
    })),
  setCompleted: (courseId, lessonId, completed) =>
    set((state) => {
      const current = new Set(state.completedByCourse[courseId] ?? []);
      if (completed) current.add(lessonId);
      else current.delete(lessonId);
      return { completedByCourse: { ...state.completedByCourse, [courseId]: current } };
    }),
  isCompleted: (courseId, lessonId) => !!get().completedByCourse[courseId]?.has(lessonId),
  getCompletedCount: (courseId) => get().completedByCourse[courseId]?.size ?? 0,
}));
