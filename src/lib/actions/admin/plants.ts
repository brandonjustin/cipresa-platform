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

function plantFields(formData: FormData) {
  return {
    scientific_name: String(formData.get('scientific_name') ?? ''),
    description: String(formData.get('description') ?? ''),
    images: splitLines(formData.get('images')),
    category_id: String(formData.get('category_id') ?? '') || null,
    climate: splitCsv(formData.get('climate')),
    soil_type: splitCsv(formData.get('soil_type')),
    water_requirement: String(formData.get('water_requirement') ?? 'medium'),
    sunlight: String(formData.get('sunlight') ?? 'full'),
    growth_duration: String(formData.get('growth_duration') ?? ''),
    harvest_time: String(formData.get('harvest_time') ?? ''),
    estimated_yield: String(formData.get('estimated_yield') ?? ''),
    region_compatibility: splitCsv(formData.get('region_compatibility')),
    disease_risks: splitCsv(formData.get('disease_risks')),
    nutritional_benefits: splitCsv(formData.get('nutritional_benefits')),
    market_value: String(formData.get('market_value') ?? ''),
    export_potential: formData.get('export_potential') === 'on',
    price: Number(formData.get('price') ?? 0),
    currency: 'XAF',
    availability: formData.get('availability') === 'on',
  };
}

export async function createPlant(formData: FormData) {
  await requireAdmin();

  const commonName = String(formData.get('common_name') ?? '').trim();
  if (!commonName) throw new Error('Le nom commun est requis.');

  const { data, error } = await supabaseAdmin
    .from('plants')
    .insert({
      common_name: commonName,
      slug: slugify(commonName),
      is_published: false,
      ...plantFields(formData),
    })
    .select('id')
    .single();

  if (error || !data) throw new Error(error?.message || 'Impossible de créer la fiche.');

  revalidatePath('/admin/encyclopedia');
  revalidateTag('plants');
  redirect(`/admin/encyclopedia/${data.id}`);
}

export async function updatePlant(plantId: string, formData: FormData) {
  await requireAdmin();

  const commonName = String(formData.get('common_name') ?? '').trim();
  if (!commonName) throw new Error('Le nom commun est requis.');

  const { error } = await supabaseAdmin
    .from('plants')
    .update({
      common_name: commonName,
      is_published: formData.get('is_published') === 'on',
      ...plantFields(formData),
    })
    .eq('id', plantId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/encyclopedia/${plantId}`);
  revalidatePath('/admin/encyclopedia');
  revalidatePath('/encyclopedia');
  revalidateTag('plants');
}
