import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getVerifiedUserId } from '@/lib/supabase/server';
import { getLearningPathBySlug, isUserOnPath } from '@/lib/data/learning-paths';
import { getUserEntitledCourseIds } from '@/lib/data/courses';
import { LearningPathView } from '@/components/course/learning-path-view';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const path = await getLearningPathBySlug(params.slug);
  if (!path) return {};

  return {
    title: path.title,
    description: path.description.slice(0, 160),
    openGraph: {
      title: path.title,
      description: path.description.slice(0, 160),
      images: path.thumbnail ? [{ url: path.thumbnail }] : undefined,
    },
  };
}

export default async function LearningPathDetailPage({ params }: { params: { slug: string } }) {
  const path = await getLearningPathBySlug(params.slug);
  if (!path) notFound();

  // Middleware already verified the session for this route and forwarded the id.
  const userId = getVerifiedUserId();
  const user = userId ? { id: userId } : null;

  const [isOnPath, entitledCourseIds] = await Promise.all([
    user ? isUserOnPath(user.id, path.id) : Promise.resolve(false),
    user ? getUserEntitledCourseIds(user.id) : Promise.resolve([] as string[]),
  ]);

  return (
    <LearningPathView
      path={path}
      isAuthenticated={!!user}
      isOnPath={isOnPath}
      entitledCourseIds={entitledCourseIds}
    />
  );
}
