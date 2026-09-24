'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BlogPost } from '@/types';

interface BlogFormProps {
  action: (formData: FormData) => Promise<void>;
  post?: BlogPost;
}

const inputClass = 'w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

export function BlogForm({ action, post }: BlogFormProps) {
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
        <input name="title" required defaultValue={post?.title} className={inputClass} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Catégorie</label>
          <input name="category" defaultValue={post?.category} className={inputClass} placeholder="Ex: Techniques agricoles" />
        </div>
        <div>
          <label className={labelClass}>Auteur</label>
          <input name="author" defaultValue={post?.author} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Image (URL)</label>
        <input name="image" defaultValue={post?.image} className={inputClass} placeholder="https://..." />
      </div>

      <div>
        <label className={labelClass}>Extrait</label>
        <textarea name="excerpt" rows={2} defaultValue={post?.excerpt} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Contenu (Markdown simple: ##, -, 1.)</label>
        <textarea name="content" rows={12} defaultValue={post?.content} className={`${inputClass} font-mono`} />
      </div>

      <div>
        <label className={labelClass}>Tags (séparés par des virgules)</label>
        <input name="tags" defaultValue={post?.tags?.join(', ')} className={inputClass} />
      </div>

      {post && (
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input type="checkbox" name="is_published" defaultChecked={post.isPublished} className="rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
            Publié
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input type="checkbox" name="featured" defaultChecked={post.featured} className="rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
            Mis en avant
          </label>
        </div>
      )}

      <Button type="submit" loading={isSubmitting}>
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : post ? 'Enregistrer' : 'Créer l\'article'}
      </Button>
    </form>
  );
}
