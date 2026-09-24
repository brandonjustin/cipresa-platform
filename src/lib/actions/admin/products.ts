'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/require-admin';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { slugify } from '@/lib/utils/format';

function splitLines(value: FormDataEntryValue | null): string[] {
  return String(value ?? '').split('\n').map((s) => s.trim()).filter(Boolean);
}

function splitCsv(value: FormDataEntryValue | null): string[] {
  return String(value ?? '').split(',').map((s) => s.trim()).filter(Boolean);
}

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get('name') ?? '').trim();
  if (!name) throw new Error('Le nom est requis.');

  const salePrice = String(formData.get('sale_price') ?? '').trim();

  const { data, error } = await supabaseAdmin
    .from('products')
    .insert({
      name,
      slug: slugify(name),
      description: String(formData.get('description') ?? ''),
      short_description: String(formData.get('short_description') ?? ''),
      images: splitLines(formData.get('images')),
      category_id: String(formData.get('category_id') ?? '') || null,
      price: Number(formData.get('price') ?? 0),
      sale_price: salePrice ? Number(salePrice) : null,
      currency: 'XAF',
      stock: Number(formData.get('stock') ?? 0),
      unit: String(formData.get('unit') ?? 'unité'),
      tags: splitCsv(formData.get('tags')),
      is_published: false,
    })
    .select('id')
    .single();

  if (error || !data) throw new Error(error?.message || 'Impossible de créer le produit.');

  revalidatePath('/admin/products');
  revalidateTag('products');
  redirect(`/admin/products/${data.id}`);
}

export async function updateProduct(productId: string, formData: FormData) {
  await requireAdmin();

  const name = String(formData.get('name') ?? '').trim();
  if (!name) throw new Error('Le nom est requis.');

  const salePrice = String(formData.get('sale_price') ?? '').trim();

  const { error } = await supabaseAdmin
    .from('products')
    .update({
      name,
      description: String(formData.get('description') ?? ''),
      short_description: String(formData.get('short_description') ?? ''),
      images: splitLines(formData.get('images')),
      category_id: String(formData.get('category_id') ?? '') || null,
      price: Number(formData.get('price') ?? 0),
      sale_price: salePrice ? Number(salePrice) : null,
      stock: Number(formData.get('stock') ?? 0),
      unit: String(formData.get('unit') ?? 'unité'),
      tags: splitCsv(formData.get('tags')),
      is_published: formData.get('is_published') === 'on',
      featured: formData.get('featured') === 'on',
    })
    .eq('id', productId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath('/admin/products');
  revalidatePath('/marketplace');
  revalidateTag('products');
}
