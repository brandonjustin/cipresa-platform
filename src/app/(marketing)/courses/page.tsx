import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getPublishedCourses, getCourseCategories } from '@/lib/data/courses';
import { CoursesBrowser } from '@/components/course/courses-browser';

export const metadata: Metadata = {
  title: 'Catalogue de formations',
  description: 'Découvrez nos formations agricoles en ligne : gestion d\'exploitation, élevage, cultures maraîchères et plus encore.',
};

// No per-request data (see src/lib/data/courses.ts) — static + ISR instead
// of a live round trip on every navigation.
export const revalidate = 300;

export default async function CoursesPage() {
  const [courses, categories] = await Promise.all([getPublishedCourses(), getCourseCategories()]);

  return (
    <Suspense>
      <CoursesBrowser courses={courses} categories={categories} />
    </Suspense>
  );
}
