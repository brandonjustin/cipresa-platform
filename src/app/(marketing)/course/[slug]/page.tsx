import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getVerifiedUserId } from '@/lib/supabase/server';
import {
  getCourseBySlug,
  getCourseCurriculum,
  getPublicCourseCurriculum,
  hasEntitlement,
  getCompletedLessonIds,
} from '@/lib/data/courses';
import { getApprovedReviews } from '@/lib/data/reviews';
import { isItemWishlisted } from '@/lib/data/wishlist';
import { CourseDetailView } from '@/components/course/course-detail-view';
import { JsonLd } from '@/components/seo/json-ld';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const course = await getCourseBySlug(params.slug);
  if (!course) return {};

  return {
    title: course.title,
    description: course.shortDescription || course.description.slice(0, 160),
    openGraph: {
      title: course.title,
      description: course.shortDescription,
      images: course.thumbnail ? [{ url: course.thumbnail }] : undefined,
    },
  };
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await getCourseBySlug(params.slug);
  if (!course) notFound();

  // Middleware already verified the session for this route and forwarded the id.
  const userId = getVerifiedUserId();
  const user = userId ? { id: userId } : null;

  // Everyone gets the cached public curriculum (all sections, preview lessons);
  // enrolled learners then fetch their full lesson list with their own session.
  const [publicSections, reviews, isEntitled, completedLessonIds, isWishlisted] = await Promise.all([
    getPublicCourseCurriculum(course.id),
    getApprovedReviews(course.id, 'course'),
    user ? hasEntitlement(user.id, course.id) : Promise.resolve(false),
    user ? getCompletedLessonIds(user.id, course.id) : Promise.resolve([]),
    user ? isItemWishlisted(user.id, 'course', course.id) : Promise.resolve(false),
  ]);
  const sections = isEntitled ? await getCourseCurriculum(course.id) : publicSections;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: course.title,
          description: course.shortDescription || course.description,
          provider: { '@type': 'Organization', name: 'CIPRESA Consulting', sameAs: process.env.NEXT_PUBLIC_SITE_URL },
          ...(course.totalReviews > 0
            ? {
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: course.rating,
                  reviewCount: course.totalReviews,
                },
              }
            : {}),
          offers: {
            '@type': 'Offer',
            price: course.price,
            priceCurrency: course.currency,
            category: 'Paid',
          },
        }}
      />
      <CourseDetailView
        course={course}
        sections={sections}
        reviews={reviews}
        isAuthenticated={!!user}
        isEntitled={isEntitled}
        completedLessonIds={completedLessonIds}
        initialIsWishlisted={isWishlisted}
      />
    </>
  );
}
