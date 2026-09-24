import { redirect } from 'next/navigation';
import { getVerifiedUserId } from '@/lib/supabase/server';
import { getCoursesByIds, getFeaturedCourses, getUserEnrollments } from '@/lib/data/courses';
import { getNextCourseInActivePath } from '@/lib/data/learning-paths';
import { DashboardView } from '@/components/dashboard/dashboard-view';

export default async function DashboardPage() {
  // Middleware already verified the session for this route and forwarded the id.
  const userId = getVerifiedUserId();
  const user = userId ? { id: userId } : null;
  if (!user) redirect('/auth/login?next=/dashboard');

  const enrollments = await getUserEnrollments(user.id);
  const enrolledIds = new Set(enrollments.map((e) => e.courseId));
  const [allEnrolledCourses, featuredCourses, nextPathCourse] = await Promise.all([
    getCoursesByIds(enrollments.map((e) => e.courseId)),
    getFeaturedCourses(4 + enrolledIds.size),
    getNextCourseInActivePath(user.id),
  ]);
  // Recommending a course the student is already enrolled in (or finished)
  // isn't a recommendation — filter those out before capping to 4.
  const popularCourses = featuredCourses.filter((c) => !enrolledIds.has(c.id)).slice(0, 4);

  const progressByCourse = Object.fromEntries(enrollments.map((e) => [e.courseId, e.progress]));
  const totalHoursLearned = allEnrolledCourses.reduce(
    (sum, c) => sum + (c.totalHours * (progressByCourse[c.id] ?? 0)) / 100,
    0
  );
  const completedCourseIds = new Set(enrollments.filter((e) => e.completedAt).map((e) => e.courseId));
  const completedCourses = completedCourseIds.size;
  // "Continuer l'apprentissage" and the "Cours en cours" stat should only
  // list courses still in progress — a finished course belongs in the
  // completed count, not in both.
  const inProgressCourses = allEnrolledCourses.filter((c) => !completedCourseIds.has(c.id));

  return (
    <DashboardView
      enrolledCourses={inProgressCourses}
      progressByCourse={progressByCourse}
      popularCourses={popularCourses}
      nextPathCourse={nextPathCourse}
      totalHoursLearned={Math.round(totalHoursLearned)}
      completedCourses={completedCourses}
    />
  );
}
