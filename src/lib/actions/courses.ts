'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email/resend';
import { enrollmentConfirmationEmail } from '@/lib/email/templates';

async function requireUser() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Vous devez être connecté.');
  return user;
}

/**
 * Self-enrollment for free courses only. Entitlements have no client-facing
 * insert policy (see migration 20260703000001), so eligibility is decided
 * here — server-side, against the authoritative price — and the actual
 * write goes through the service-role client. Paid courses only ever get
 * an entitlement via the Nokash webhook after a confirmed payment.
 */
export async function enrollInFreeCourse(courseId: string) {
  const user = await requireUser();
  const supabase = createServerSupabaseClient();

  const { data: course } = await supabase
    .from('courses')
    .select('id, title, slug, price')
    .eq('id', courseId)
    .eq('is_published', true)
    .single();

  if (!course) throw new Error('Cours introuvable.');
  if (Number(course.price) > 0) throw new Error('Ce cours n\'est pas gratuit.');

  const { error } = await supabaseAdmin
    .from('entitlements')
    .upsert(
      { user_id: user.id, course_id: courseId, source: 'free' },
      { onConflict: 'user_id,course_id', ignoreDuplicates: true }
    );
  if (error) throw new Error(error.message);

  const { error: enrollError } = await supabaseAdmin
    .from('enrollments')
    .upsert(
      { user_id: user.id, course_id: courseId },
      { onConflict: 'user_id,course_id', ignoreDuplicates: true }
    );
  if (enrollError) throw new Error(enrollError.message);

  const { data: profile } = await supabase.from('profiles').select('email, full_name').eq('id', user.id).single();
  if (profile) {
    await sendEmail({
      to: profile.email,
      subject: `Accès débloqué : ${course.title}`,
      html: enrollmentConfirmationEmail({
        fullName: profile.full_name,
        courseTitle: course.title,
        courseSlug: course.slug,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      }),
    });
  }

  revalidatePath(`/course/[slug]`, 'page');
  revalidatePath('/dashboard');
}

export async function toggleLessonProgress(courseId: string, lessonId: string, completed: boolean) {
  const user = await requireUser();
  const supabase = createServerSupabaseClient();

  if (completed) {
    const { error } = await supabase
      .from('lesson_progress')
      .upsert(
        { user_id: user.id, course_id: courseId, lesson_id: lessonId },
        { onConflict: 'user_id,lesson_id', ignoreDuplicates: true }
      );
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from('lesson_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId);
    if (error) throw new Error(error.message);
  }

  // Keep enrollments.progress (what the dashboard reads) in sync with the
  // lesson_progress rows that actually track completion — nothing else
  // recomputes it.
  const [{ count: totalLessons }, { count: completedCount }] = await Promise.all([
    supabase.from('lessons').select('*', { count: 'exact', head: true }).eq('course_id', courseId),
    supabase.from('lesson_progress').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('course_id', courseId),
  ]);
  const progress = totalLessons ? Math.min(100, Math.round(((completedCount ?? 0) / totalLessons) * 100)) : 0;

  const { error: enrollError } = await supabase.from('enrollments').upsert(
    {
      user_id: user.id,
      course_id: courseId,
      progress,
      current_lesson: lessonId,
      completed_at: progress >= 100 ? new Date().toISOString() : null,
    },
    { onConflict: 'user_id,course_id' }
  );
  if (enrollError) throw new Error(enrollError.message);

  revalidatePath(`/course/[slug]/learn`, 'page');
  revalidatePath('/dashboard');
}

export async function submitReview(params: {
  targetId: string;
  targetType: 'course' | 'product';
  rating: number;
  comment: string;
}) {
  const user = await requireUser();
  const supabase = createServerSupabaseClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar')
    .eq('id', user.id)
    .single();

  const { error } = await supabase.from('reviews').upsert(
    {
      user_id: user.id,
      user_name: profile?.full_name ?? 'Utilisateur',
      user_avatar: profile?.avatar ?? null,
      target_id: params.targetId,
      target_type: params.targetType,
      rating: params.rating,
      comment: params.comment,
      is_approved: false,
    },
    { onConflict: 'user_id,target_id,target_type' }
  );
  if (error) throw new Error(error.message);

  revalidatePath(`/course/[slug]`, 'page');
  revalidatePath(`/product/[slug]`, 'page');
}

export async function startLearningPath(pathId: string) {
  const user = await requireUser();
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from('learning_path_enrollments')
    .upsert({ user_id: user.id, path_id: pathId }, { onConflict: 'user_id,path_id', ignoreDuplicates: true });
  if (error) throw new Error(error.message);

  revalidatePath(`/paths/[slug]`, 'page');
  revalidatePath('/dashboard');
}
