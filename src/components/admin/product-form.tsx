'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Product, ProductCategory } from '@/types';

interface ProductFormProps {
  categories: ProductCategory[];
  action: (formData: FormData) => Promise<void>;
  product?: Product;
}

const inputClass = 'w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

export function ProductForm({ categories, action, product }: ProductFormProps) {
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
        <label className={labelClass}>Nom *</label>
        <input name="name" required defaultValue={product?.name} className={inputClass} placeholder="Ex: Engrais Organique Premium" />
      </div>

      <div>
        <label className={labelClass}>Description courte</label>
        <input name="short_description" defaultValue={product?.shortDescription} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea name="description" rows={4} defaultValue={product?.description} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Images (une URL par ligne)</label>
        <textarea name="images" rows={2} defaultValue={product?.images?.join('\n')} className={inputClass} placeholder="https://..." />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Catégorie</label>
          <select name="category_id" defaultValue={product?.category?.id} className={inputClass}>
            <option value="">—</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Unité (ex: kg, pied, sac 50kg)</label>
          <input name="unit" defaultValue={product?.unit} className={inputClass} />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Prix (XAF)</label>
          <input name="price" type="number" min={0} required defaultValue={product?.price} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Prix promo (optionnel)</label>
          <input name="sale_price" type="number" min={0} defaultValue={product?.salePrice} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Stock</label>
          <input name="stock" type="number" min={0} defaultValue={product?.stock ?? 0} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Tags (séparés par des virgules)</label>
        <input name="tags" defaultValue={product?.tags?.join(', ')} className={inputClass} />
      </div>

      {product && (
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input type="checkbox" name="is_published" defaultChecked={product.isPublished} className="rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
            Publié (visible sur le site)
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input type="checkbox" name="featured" defaultChecked={product.featured} className="rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
            Mis en avant
          </label>
        </div>
      )}

      <Button type="submit" loading={isSubmitting}>
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : product ? 'Enregistrer' : 'Créer le produit'}
      </Button>
    </form>
  );
}
