'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/require-admin';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { slugify } from '@/lib/utils/format';

function splitLines(value: FormDataEntryValue | null): string[] {
  return String(value ?? '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitCsv(value: FormDataEntryValue | null): string[] {
  return String(value ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createCourse(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get('title') ?? '').trim();
  if (!title) throw new Error('Le titre est requis.');

  const { data, error } = await supabaseAdmin
    .from('courses')
    .insert({
      title,
      slug: slugify(title),
      description: String(formData.get('description') ?? ''),
      short_description: String(formData.get('short_description') ?? ''),
      thumbnail: String(formData.get('thumbnail') ?? ''),
      category_id: String(formData.get('category_id') ?? '') || null,
      instructor_id: String(formData.get('instructor_id') ?? '') || null,
      price: Number(formData.get('price') ?? 0),
      currency: 'XAF',
      duration: String(formData.get('duration') ?? ''),
      level: String(formData.get('level') ?? 'all'),
      tags: splitCsv(formData.get('tags')),
      requirements: splitLines(formData.get('requirements')),
      what_you_will_learn: splitLines(formData.get('what_you_will_learn')),
      is_published: false,
    })
    .select('id')
    .single();

  if (error || !data) throw new Error(error?.message || 'Impossible de créer le cours.');

  revalidatePath('/admin/courses');
  revalidateTag('courses');
  redirect(`/admin/courses/${data.id}`);
}

export async function updateCourse(courseId: string, formData: FormData) {
  await requireAdmin();

  const title = String(formData.get('title') ?? '').trim();
  if (!title) throw new Error('Le titre est requis.');

  const { error } = await supabaseAdmin
    .from('courses')
    .update({
      title,
      description: String(formData.get('description') ?? ''),
      short_description: String(formData.get('short_description') ?? ''),
      thumbnail: String(formData.get('thumbnail') ?? ''),
      category_id: String(formData.get('category_id') ?? '') || null,
      instructor_id: String(formData.get('instructor_id') ?? '') || null,
      price: Number(formData.get('price') ?? 0),
      duration: String(formData.get('duration') ?? ''),
      level: String(formData.get('level') ?? 'all'),
      tags: splitCsv(formData.get('tags')),
      requirements: splitLines(formData.get('requirements')),
      what_you_will_learn: splitLines(formData.get('what_you_will_learn')),
      is_published: formData.get('is_published') === 'on',
      featured: formData.get('featured') === 'on',
    })
    .eq('id', courseId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath('/admin/courses');
  revalidatePath('/courses');
  revalidateTag('courses');
}

export async function createSection(courseId: string, formData: FormData) {
  await requireAdmin();
  const title = String(formData.get('title') ?? '').trim();
  if (!title) throw new Error('Le titre de la section est requis.');

  const { count } = await supabaseAdmin.from('sections').select('*', { count: 'exact', head: true }).eq('course_id', courseId);

  const { error } = await supabaseAdmin.from('sections').insert({
    course_id: courseId,
    title,
    display_order: (count ?? 0) + 1,
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/courses/${courseId}`);
  revalidateTag('courses');
}

export async function deleteSection(courseId: string, sectionId: string) {
  await requireAdmin();
  const { error } = await supabaseAdmin.from('sections').delete().eq('id', sectionId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/courses/${courseId}`);
  revalidateTag('courses');
}

export async function createLesson(courseId: string, sectionId: string, formData: FormData) {
  await requireAdmin();
  const title = String(formData.get('title') ?? '').trim();
  if (!title) throw new Error('Le titre de la leçon est requis.');

  const { count } = await supabaseAdmin.from('lessons').select('*', { count: 'exact', head: true }).eq('section_id', sectionId);

  const { error } = await supabaseAdmin.from('lessons').insert({
    course_id: courseId,
    section_id: sectionId,
    title,
    slug: slugify(title),
    video_url: String(formData.get('video_url') ?? '') || null,
    video_duration: String(formData.get('video_duration') ?? '0:00'),
    is_preview: formData.get('is_preview') === 'on',
    is_free: formData.get('is_preview') === 'on',
    display_order: (count ?? 0) + 1,
  });
  if (error) throw new Error(error.message);

  await recomputeCourseLessonCount(courseId);
  revalidatePath(`/admin/courses/${courseId}`);
  revalidateTag('courses');
}

export async function updateLesson(courseId: string, lessonId: string, formData: FormData) {
  await requireAdmin();
  const { error } = await supabaseAdmin
    .from('lessons')
    .update({
      title: String(formData.get('title') ?? ''),
      description: String(formData.get('description') ?? ''),
      video_url: String(formData.get('video_url') ?? '') || null,
      video_duration: String(formData.get('video_duration') ?? '0:00'),
      is_preview: formData.get('is_preview') === 'on',
      is_free: formData.get('is_preview') === 'on',
    })
    .eq('id', lessonId);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/courses/${courseId}`);
  revalidateTag('courses');
}

export async function deleteLesson(courseId: string, lessonId: string) {
  await requireAdmin();
  const { error } = await supabaseAdmin.from('lessons').delete().eq('id', lessonId);
  if (error) throw new Error(error.message);
  await recomputeCourseLessonCount(courseId);
  revalidatePath(`/admin/courses/${courseId}`);
  revalidateTag('courses');
}

async function recomputeCourseLessonCount(courseId: string) {
  const { count } = await supabaseAdmin.from('lessons').select('*', { count: 'exact', head: true }).eq('course_id', courseId);
  await supabaseAdmin.from('courses').update({ total_lessons: count ?? 0 }).eq('id', courseId);
}
