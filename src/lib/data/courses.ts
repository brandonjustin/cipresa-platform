import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabasePublic } from '@/lib/supabase/public';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { Course, CourseCategory, Instructor, Lesson, Section } from '@/types';

// Hand-typed row shapes matching supabase/migrations/20260703000001_init.sql.
// No generated Database types exist yet (no live project to run
// `supabase gen types typescript` against) — these keep the mapping
// functions below honest until that's wired up.
interface CourseCategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  display_order: number;
}

interface InstructorRow {
  id: string;
  user_id: string | null;
  full_name: string;
  avatar: string | null;
  title: string;
  bio: string | null;
  expertise: string[];
  total_courses: number;
  total_students: number;
  total_reviews: number;
  rating: number;
  social_links: Record<string, string>;
}

interface CourseRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  thumbnail: string | null;
  preview_video: string | null;
  price: number;
  sale_price: number | null;
  currency: string;
  duration: string | null;
  total_lessons: number;
  total_hours: number;
  level: Course['level'];
  language: string;
  rating: number;
  total_reviews: number;
  total_students: number;
  featured: boolean;
  popular: boolean;
  tags: string[];
  requirements: string[];
  what_you_will_learn: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
  category: CourseCategoryRow;
  instructor: InstructorRow;
}

interface SectionRow {
  id: string;
  course_id: string;
  title: string;
  display_order: number;
}

interface LessonRow {
  id: string;
  course_id: string;
  section_id: string;
  title: string;
  slug: string;
  description: string | null;
  video_url: string | null;
  video_duration: string | null;
  display_order: number;
  is_preview: boolean;
  is_free: boolean;
  created_at: string;
}

function mapCategory(row: CourseCategoryRow): CourseCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? '',
    icon: row.icon ?? '',
    image: row.image ?? '',
    count: 0,
  };
}

function mapInstructor(row: InstructorRow): Instructor {
  return {
    id: row.id,
    userId: row.user_id ?? '',
    fullName: row.full_name,
    avatar: row.avatar ?? '',
    title: row.title,
    bio: row.bio ?? '',
    expertise: row.expertise ?? [],
    totalCourses: row.total_courses,
    totalStudents: row.total_students,
    totalReviews: row.total_reviews,
    rating: row.rating,
    socialLinks: row.social_links ?? {},
  };
}

function mapCourse(row: CourseRow): Course {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description ?? '',
    shortDescription: row.short_description ?? '',
    thumbnail: row.thumbnail ?? '',
    previewVideo: row.preview_video ?? undefined,
    category: mapCategory(row.category),
    instructor: mapInstructor(row.instructor),
    price: Number(row.price),
    salePrice: row.sale_price !== null ? Number(row.sale_price) : undefined,
    currency: row.currency,
    duration: row.duration ?? '',
    totalLessons: row.total_lessons,
    totalHours: Number(row.total_hours),
    level: row.level,
    language: row.language,
    rating: Number(row.rating),
    totalReviews: row.total_reviews,
    totalStudents: row.total_students,
    featured: row.featured,
    popular: row.popular,
    isPublished: row.is_published,
    tags: row.tags ?? [],
    requirements: row.requirements ?? [],
    whatYouWillLearn: row.what_you_will_learn ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapLesson(row: LessonRow): Lesson {
  return {
    id: row.id,
    courseId: row.course_id,
    sectionId: row.section_id,
    title: row.title,
    slug: row.slug,
    description: row.description ?? '',
    videoUrl: row.video_url ?? undefined,
    videoDuration: row.video_duration ?? '0:00',
    order: row.display_order,
    isPreview: row.is_preview,
    isFree: row.is_free,
    resources: [],
    createdAt: row.created_at,
  };
}

const COURSE_SELECT = '*, category:course_categories(*), instructor:instructors(*)';

export async function getPublishedCourses(filters?: {
  categorySlug?: string;
  level?: string;
  search?: string;
}): Promise<Course[]> {
  let query = supabasePublic.from('courses').select(COURSE_SELECT).eq('is_published', true);

  if (filters?.level) query = query.eq('level', filters.level);
  if (filters?.search) query = query.ilike('title', `%${filters.search}%`);

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error || !data) return [];

  let courses = (data as unknown as CourseRow[]).map(mapCourse);
  if (filters?.categorySlug) {
    courses = courses.filter((c) => c.category.slug === filters.categorySlug);
  }
  return courses;
}

export async function getFeaturedCourses(limit = 8): Promise<Course[]> {
  const { data, error } = await supabasePublic
    .from('courses')
    .select(COURSE_SELECT)
    .eq('is_published', true)
    .eq('featured', true)
    .limit(limit);
  if (error || !data) return [];
  return (data as unknown as CourseRow[]).map(mapCourse);
}

// Public, published-only data: served from Next's data cache (shared across
// visitors, refreshed every 5 minutes) with the cookie-free public client,
// instead of one Supabase round trip per page view. React cache() still
// dedupes generateMetadata() + the page within a single request.
const getCourseBySlugCached = unstable_cache(
  async (slug: string): Promise<Course | null> => {
    const { data, error } = await supabasePublic
      .from('courses')
      .select(COURSE_SELECT)
      .eq('slug', slug)
      .eq('is_published', true)
      .single();
    if (error || !data) return null;
    return mapCourse(data as unknown as CourseRow);
  },
  ['course-by-slug'],
  { revalidate: 300, tags: ['courses'] }
);

export const getCourseBySlug = cache((slug: string) => getCourseBySlugCached(slug));

export async function getCoursesByIds(ids: string[]): Promise<Course[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabasePublic.from('courses').select(COURSE_SELECT).in('id', ids);
  if (error || !data) return [];
  return (data as unknown as CourseRow[]).map(mapCourse);
}

export async function getCourseCategories(): Promise<CourseCategory[]> {
  const { data, error } = await supabasePublic
    .from('course_categories')
    .select('*')
    .order('display_order');
  if (error || !data) return [];
  return (data as CourseCategoryRow[]).map(mapCategory);
}

/** Course categories with the live count of published courses in each — the
 * plain select above always returns count: 0 since that's not a stored column. */
export async function getCourseCategoriesWithCounts(): Promise<CourseCategory[]> {
  const [{ data: categoryRows }, { data: courseRows }] = await Promise.all([
    supabasePublic.from('course_categories').select('*').order('display_order'),
    supabasePublic.from('courses').select('category_id').eq('is_published', true),
  ]);
  if (!categoryRows) return [];

  const counts = new Map<string, number>();
  for (const row of (courseRows ?? []) as { category_id: string }[]) {
    counts.set(row.category_id, (counts.get(row.category_id) ?? 0) + 1);
  }

  return (categoryRows as CourseCategoryRow[]).map((row) => ({
    ...mapCategory(row),
    count: counts.get(row.id) ?? 0,
  }));
}

/** Sections with their lessons, ordered — the single source of curriculum
 * data, replacing the two divergent hardcoded arrays that used to live in
 * course/[slug]/page.tsx and course/[slug]/learn/page.tsx. */
/** Curriculum as an anonymous visitor sees it (RLS: all sections, preview
 * lessons only). Identical for every non-enrolled visitor, so it is cached. */
export const getPublicCourseCurriculum = unstable_cache(
  async (courseId: string): Promise<Section[]> => {
    const [{ data: sectionRows }, { data: lessonRows }] = await Promise.all([
      supabasePublic.from('sections').select('*').eq('course_id', courseId).order('display_order'),
      supabasePublic.from('lessons').select('*').eq('course_id', courseId).order('display_order'),
    ]);
    const sections = (sectionRows ?? []) as SectionRow[];
    const lessons = (lessonRows ?? []) as LessonRow[];
    return sections.map((s) => ({
      id: s.id,
      courseId: s.course_id,
      title: s.title,
      order: s.display_order,
      lessons: lessons.filter((l) => l.section_id === s.id).map(mapLesson),
    }));
  },
  ['course-curriculum-public'],
  { revalidate: 300, tags: ['courses'] }
);

/** Full curriculum with the visitor's own session (enrolled users see every
 * lesson through RLS). Never cached across users. */
export async function getCourseCurriculum(courseId: string): Promise<Section[]> {
  const supabase = createServerSupabaseClient();
  const [{ data: sectionRows }, { data: lessonRows }] = await Promise.all([
    supabase.from('sections').select('*').eq('course_id', courseId).order('display_order'),
    supabase.from('lessons').select('*').eq('course_id', courseId).order('display_order'),
  ]);

  const sections = (sectionRows ?? []) as SectionRow[];
  const lessons = (lessonRows ?? []) as LessonRow[];

  return sections.map((s) => ({
    id: s.id,
    courseId: s.course_id,
    title: s.title,
    order: s.display_order,
    lessons: lessons.filter((l) => l.section_id === s.id).map(mapLesson),
  }));
}

/** True if the given user currently has active (non-revoked) access to the course. */
export async function hasEntitlement(userId: string, courseId: string): Promise<boolean> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('entitlements')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .is('revoked_at', null)
    .maybeSingle();
  return !!data;
}

/** Course IDs the given user currently has active access to. */
export async function getUserEntitledCourseIds(userId: string): Promise<string[]> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('entitlements')
    .select('course_id')
    .eq('user_id', userId)
    .is('revoked_at', null);
  return (data ?? []).map((row) => row.course_id as string);
}

export interface EnrollmentProgress {
  courseId: string;
  progress: number;
  currentLessonId: string | null;
  completedAt: string | null;
}

export async function getUserEnrollments(userId: string): Promise<EnrollmentProgress[]> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('enrollments')
    .select('course_id, progress, current_lesson, completed_at')
    .eq('user_id', userId);

  return (data ?? []).map((row) => ({
    courseId: row.course_id as string,
    progress: Number(row.progress),
    currentLessonId: (row.current_lesson as string) ?? null,
    completedAt: (row.completed_at as string) ?? null,
  }));
}

export async function getCompletedLessonIds(userId: string, courseId: string): Promise<string[]> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', userId)
    .eq('course_id', courseId);
  return (data ?? []).map((row) => row.lesson_id as string);
}

// ==================== Admin (service role — bypasses is_published filter) ====================

export async function getAllCoursesForAdmin(): Promise<Course[]> {
  const { data, error } = await supabaseAdmin.from('courses').select(COURSE_SELECT).order('created_at', { ascending: false });
  if (error || !data) return [];
  return (data as unknown as CourseRow[]).map(mapCourse);
}

export async function getCourseByIdForAdmin(id: string): Promise<Course | null> {
  const { data, error } = await supabaseAdmin.from('courses').select(COURSE_SELECT).eq('id', id).single();
  if (error || !data) return null;
  return mapCourse(data as unknown as CourseRow);
}

export async function getAllInstructors(): Promise<Instructor[]> {
  const { data, error } = await supabaseAdmin.from('instructors').select('*').order('full_name');
  if (error || !data) return [];
  return (data as InstructorRow[]).map(mapInstructor);
}
