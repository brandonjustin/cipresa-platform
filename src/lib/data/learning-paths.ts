import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabasePublic } from '@/lib/supabase/public';
import type { LearningPath } from '@/types';
import { getCoursesByIds } from './courses';

interface LearningPathRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  level: LearningPath['level'];
}

interface LearningPathCourseRow {
  path_id: string;
  display_order: number;
  is_required: boolean;
  course: {
    id: string;
  };
}

// One query for the junction rows plus one batched `in(id, ...)` lookup for
// the courses themselves, instead of a separate getCourseBySlug() round trip
// per course in the path.
async function assembleLearningPath(row: LearningPathRow): Promise<LearningPath | null> {
  const { data: pathCourses } = await supabasePublic
    .from('learning_path_courses')
    .select('path_id, display_order, is_required, course:courses(id)')
    .eq('path_id', row.id)
    .order('display_order');

  const rows = (pathCourses ?? []) as unknown as LearningPathCourseRow[];
  const courses = await getCoursesByIds(rows.map((r) => r.course.id));
  const courseById = new Map(courses.map((c) => [c.id, c]));

  const resolvedCourses = rows
    .map((r) => {
      const course = courseById.get(r.course.id);
      return course ? { course, order: r.display_order, isRequired: r.is_required } : null;
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description ?? '',
    thumbnail: row.thumbnail ?? '',
    level: row.level,
    courses: resolvedCourses,
  };
}

export async function getPublishedLearningPaths(): Promise<LearningPath[]> {
  const { data, error } = await supabasePublic
    .from('learning_paths')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });
  if (error || !data) return [];

  const paths = await Promise.all((data as LearningPathRow[]).map(assembleLearningPath));
  return paths.filter((p): p is LearningPath => p !== null);
}

// Public, published-only data: served from Next's data cache (shared across
// visitors, refreshed every 5 minutes) with the cookie-free public client,
// instead of one Supabase round trip per page view. React cache() still
// dedupes generateMetadata() + the page within a single request.
const getLearningPathBySlugCached = unstable_cache(
  async (slug: string): Promise<LearningPath | null> => {
    const { data, error } = await supabasePublic
      .from('learning_paths')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();
    if (error || !data) return null;
    return assembleLearningPath(data as LearningPathRow);
  },
  ['learning-path-by-slug'],
  { revalidate: 300, tags: ['learning-paths'] }
);

export const getLearningPathBySlug = cache((slug: string) => getLearningPathBySlugCached(slug));

export async function isUserOnPath(userId: string, pathId: string): Promise<boolean> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('learning_path_enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('path_id', pathId)
    .maybeSingle();
  return !!data;
}

export interface NextPathCourse {
  pathTitle: string;
  pathSlug: string;
  course: LearningPath['courses'][number]['course'];
}

/** The next not-yet-owned course in the first learning path the user is actively working through, if any. */
export async function getNextCourseInActivePath(userId: string): Promise<NextPathCourse | null> {
  const supabase = createServerSupabaseClient();
  const { data: activeEnrollments } = await supabase
    .from('learning_path_enrollments')
    .select('path_id, learning_paths(id, title, slug, description, thumbnail, level)')
    .eq('user_id', userId)
    .is('completed_at', null)
    .limit(1);

  const enrollment = (activeEnrollments ?? [])[0] as unknown as
    | { path_id: string; learning_paths: LearningPathRow }
    | undefined;
  if (!enrollment) return null;

  const path = await assembleLearningPath(enrollment.learning_paths);
  if (!path) return null;

  const { data: entitlementRows } = await supabase
    .from('entitlements')
    .select('course_id')
    .eq('user_id', userId)
    .is('revoked_at', null);
  const owned = new Set((entitlementRows ?? []).map((r) => r.course_id as string));

  const next = path.courses.find((c) => !owned.has(c.course.id));
  return next ? { pathTitle: path.title, pathSlug: path.slug, course: next.course } : null;
}
