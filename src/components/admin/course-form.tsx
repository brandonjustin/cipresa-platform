'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Course, CourseCategory, Instructor } from '@/types';

interface CourseFormProps {
  categories: CourseCategory[];
  instructors: Instructor[];
  action: (formData: FormData) => Promise<void>;
  course?: Course;
}

const inputClass = 'w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

export function CourseForm({ categories, instructors, action, course }: CourseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await action(formData);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue.');
      setIsSubmitting(false);
    }
  };

  return (
    <form action={handleSubmit} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-5 max-w-3xl">
      <div>
        <label className={labelClass}>Titre *</label>
        <input name="title" required defaultValue={course?.title} className={inputClass} placeholder="Ex: Culture de la Tomate" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Description courte</label>
          <input name="short_description" defaultValue={course?.shortDescription} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Image (URL)</label>
          <input name="thumbnail" defaultValue={course?.thumbnail} className={inputClass} placeholder="https://..." />
        </div>
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea name="description" rows={4} defaultValue={course?.description} className={inputClass} />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Catégorie</label>
          <select name="category_id" defaultValue={course?.category?.id} className={inputClass}>
            <option value="">—</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Instructeur</label>
          <select name="instructor_id" defaultValue={course?.instructor?.id} className={inputClass}>
            <option value="">—</option>
            {instructors.map((i) => <option key={i.id} value={i.id}>{i.fullName}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Niveau</label>
          <select name="level" defaultValue={course?.level ?? 'all'} className={inputClass}>
            <option value="all">Tous niveaux</option>
            <option value="beginner">Débutant</option>
            <option value="intermediate">Intermédiaire</option>
            <option value="advanced">Avancé</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Prix (XAF, 0 = gratuit)</label>
          <input name="price" type="number" min={0} defaultValue={course?.price ?? 0} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Durée (ex: 6 semaines)</label>
          <input name="duration" defaultValue={course?.duration} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Tags (séparés par des virgules)</label>
        <input name="tags" defaultValue={course?.tags?.join(', ')} className={inputClass} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Prérequis (un par ligne)</label>
          <textarea name="requirements" rows={3} defaultValue={course?.requirements?.join('\n')} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Ce que vous apprendrez (un par ligne)</label>
          <textarea name="what_you_will_learn" rows={3} defaultValue={course?.whatYouWillLearn?.join('\n')} className={inputClass} />
        </div>
      </div>

      {course && (
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input type="checkbox" name="is_published" defaultChecked={course.isPublished} className="rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
            Publié (visible sur le site)
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input type="checkbox" name="featured" defaultChecked={course.featured} className="rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
            Mis en avant
          </label>
        </div>
      )}

      <Button type="submit" loading={isSubmitting}>
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : course ? 'Enregistrer' : 'Créer le cours'}
      </Button>
    </form>
  );
}
