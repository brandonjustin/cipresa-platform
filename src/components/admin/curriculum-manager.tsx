'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { ChevronDown, Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { createSection, deleteSection, createLesson, updateLesson, deleteLesson } from '@/lib/actions/admin/courses';
import type { Section } from '@/types';

const inputClass = 'px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

export function CurriculumManager({ courseId, sections }: { courseId: string; sections: Section[] }) {
  const [expanded, setExpanded] = useState<string[]>(sections.map((s) => s.id));
  const [isPending, setIsPending] = useState(false);

  const toggle = (id: string) => setExpanded((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const run = async (fn: () => Promise<void>) => {
    setIsPending(true);
    try {
      await fn();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 max-w-3xl">
      <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Contenu du cours</h2>

      <div className="space-y-3 mb-5">
        {sections.map((section) => (
          <div key={section.id} className="border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50">
              <button type="button" onClick={() => toggle(section.id)} className="flex items-center gap-2 flex-1 text-left">
                <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform', expanded.includes(section.id) && 'rotate-180')} />
                <span className="text-sm font-semibold">{section.title}</span>
                <span className="text-xs text-gray-500">({section.lessons.length} leçons)</span>
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => run(() => deleteSection(courseId, section.id))}
                className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/30 text-red-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {expanded.includes(section.id) && (
              <div className="p-3 space-y-3">
                {section.lessons.map((lesson) => (
                  <form
                    key={lesson.id}
                    action={async (formData) => run(() => updateLesson(courseId, lesson.id, formData))}
                    className="grid sm:grid-cols-12 gap-2 items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-900/30"
                  >
                    <input name="title" defaultValue={lesson.title} className={cn(inputClass, 'sm:col-span-4')} placeholder="Titre" />
                    <input name="video_url" defaultValue={lesson.videoUrl} className={cn(inputClass, 'sm:col-span-4')} placeholder="URL vidéo (Cloudinary...)" />
                    <input name="video_duration" defaultValue={lesson.videoDuration} className={cn(inputClass, 'sm:col-span-1')} placeholder="15:00" />
                    <label className="sm:col-span-1 flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                      <input type="checkbox" name="is_preview" defaultChecked={lesson.isPreview} className="rounded border-gray-300" /> Aperçu
                    </label>
                    <div className="sm:col-span-2 flex items-center gap-1 justify-end">
                      <button type="submit" disabled={isPending} className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-950/30 text-blue-600 text-xs font-medium px-2">
                        Sauver
                      </button>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => run(() => deleteLesson(courseId, lesson.id))}
                        className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/30 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                ))}

                <AddLessonForm courseId={courseId} sectionId={section.id} disabled={isPending} run={run} />
              </div>
            )}
          </div>
        ))}
        {sections.length === 0 && <p className="text-sm text-gray-500 py-4 text-center">Aucune section pour le moment.</p>}
      </div>

      <form
        action={async (formData) => {
          await run(() => createSection(courseId, formData));
        }}
        className="flex items-center gap-2"
      >
        <input name="title" required className={cn(inputClass, 'flex-1')} placeholder="Titre de la nouvelle section" />
        <Button type="submit" size="sm" icon={Plus} iconPosition="left" disabled={isPending}>
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ajouter une section'}
        </Button>
      </form>
    </div>
  );
}

function AddLessonForm({
  courseId,
  sectionId,
  disabled,
  run,
}: {
  courseId: string;
  sectionId: string;
  disabled: boolean;
  run: (fn: () => Promise<void>) => Promise<void>;
}) {
  return (
    <form
      action={async (formData) => run(() => createLesson(courseId, sectionId, formData))}
      className="grid sm:grid-cols-12 gap-2 items-center pt-2 border-t border-dashed border-gray-200 dark:border-gray-700"
    >
      <input name="title" required className={cn(inputClass, 'sm:col-span-5')} placeholder="Titre de la nouvelle leçon" />
      <input name="video_url" className={cn(inputClass, 'sm:col-span-4')} placeholder="URL vidéo (optionnel)" />
      <input name="video_duration" className={cn(inputClass, 'sm:col-span-1')} placeholder="15:00" />
      <label className="sm:col-span-1 flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
        <input type="checkbox" name="is_preview" className="rounded border-gray-300" /> Aperçu
      </label>
      <Button type="submit" size="sm" className="sm:col-span-1" disabled={disabled} icon={Plus} />
    </form>
  );
}
