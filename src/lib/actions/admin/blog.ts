'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/require-admin';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { slugify } from '@/lib/utils/format';

function splitCsv(value: FormDataEntryValue | null): string[] {
  return String(value ?? '').split(',').map((s) => s.trim()).filter(Boolean);
}

export async function createBlogPost(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get('title') ?? '').trim();
  if (!title) throw new Error('Le titre est requis.');

  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .insert({
      title,
      slug: slugify(title),
      excerpt: String(formData.get('excerpt') ?? ''),
      content: String(formData.get('content') ?? ''),
      image: String(formData.get('image') ?? ''),
      category: String(formData.get('category') ?? ''),
      author: String(formData.get('author') ?? ''),
      tags: splitCsv(formData.get('tags')),
      is_published: false,
    })
    .select('id')
    .single();

  if (error || !data) throw new Error(error?.message || 'Impossible de créer l\'article.');

  revalidatePath('/admin/blog');
  redirect(`/admin/blog/${data.id}`);
}

export async function updateBlogPost(postId: string, formData: FormData) {
  await requireAdmin();

  const title = String(formData.get('title') ?? '').trim();
  if (!title) throw new Error('Le titre est requis.');

  const isPublished = formData.get('is_published') === 'on';

  const { data: existing } = await supabaseAdmin.from('blog_posts').select('published_at').eq('id', postId).single();

  const { error } = await supabaseAdmin
    .from('blog_posts')
    .update({
      title,
      excerpt: String(formData.get('excerpt') ?? ''),
      content: String(formData.get('content') ?? ''),
      image: String(formData.get('image') ?? ''),
      category: String(formData.get('category') ?? ''),
      author: String(formData.get('author') ?? ''),
      tags: splitCsv(formData.get('tags')),
      is_published: isPublished,
      featured: formData.get('featured') === 'on',
      published_at: isPublished ? (existing?.published_at ?? new Date().toISOString()) : existing?.published_at ?? null,
    })
    .eq('id', postId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/blog/${postId}`);
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}
