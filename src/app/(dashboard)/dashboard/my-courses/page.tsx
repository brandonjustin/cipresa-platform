import { redirect } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, Play, CheckCircle2, ArrowUpRight, Award } from 'lucide-react';
import { getVerifiedUserId } from '@/lib/supabase/server';
import { getCoursesByIds, getUserEnrollments } from '@/lib/data/courses';
import { BgImage } from '@/components/ui/bg-image';

export default async function MyCoursesPage() {
  // Middleware already verified the session for this route and forwarded the id.
  const userId = getVerifiedUserId();
  const user = userId ? { id: userId } : null;
  if (!user) redirect('/auth/login?next=/dashboard/my-courses');

  const enrollments = await getUserEnrollments(user.id);
  const courses = await getCoursesByIds(enrollments.map((e) => e.courseId));
  const progressByCourse = Object.fromEntries(enrollments.map((e) => [e.courseId, e]));

  const inProgress = courses.filter((c) => !progressByCourse[c.id]?.completedAt);
  const completed = courses.filter((c) => progressByCourse[c.id]?.completedAt);

  if (courses.length === 0) {
    return (
      <div className="relative overflow-hidden bg-white px-6 py-16 text-center shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:py-20">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-20 h-[220px] w-[220px] rounded-full border border-[#ff7a3d]/25 opacity-70"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,122,61,.35) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
        />
        <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ff7a3d] text-white">
          <GraduationCap className="h-7 w-7" />
        </span>
        <h2 className="relative mt-6 font-display text-[24px] font-medium leading-tight text-black sm:text-[28px]">
          Aucune formation pour le moment
        </h2>
        <p className="relative mx-auto mt-2 max-w-md text-[14px] font-medium leading-[1.6] text-black/60">
          Vous n&apos;êtes inscrit à aucune formation pour le moment.
        </p>
        <div className="relative mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/courses"
            className="group inline-flex h-[44px] items-center gap-2 bg-black px-6 text-[13px] font-semibold text-white transition-colors hover:bg-[#ff7a3d]"
          >
            Explorer les formations
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </Link>
          <Link
            href="/paths"
            className="inline-flex h-[44px] items-center px-6 text-[13px] font-semibold text-black ring-1 ring-black/15 transition-colors hover:bg-[#f6f5f2]"
          >
            Voir les parcours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {inProgress.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-3 text-[13px] font-semibold text-black">
            <span className="text-[20px] font-black leading-none text-[#ff7a3d]">{String(inProgress.length).padStart(2, '0')}</span>
            En cours
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {inProgress.map((course) => {
              const enrollment = progressByCourse[course.id];
              const progress = enrollment?.progress ?? 0;
              return (
                <Link
                  key={course.id}
                  href={`/course/${course.slug}/learn${enrollment?.currentLessonId ? `?lesson=${enrollment.currentLessonId}` : ''}`}
                  className="group flex gap-4 bg-white p-4 shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-transparent transition-all duration-300 hover:ring-[#ff7a3d]"
                >
                  <div className="relative h-24 w-32 shrink-0 overflow-hidden bg-[#f6f5f2]">
                    {course.thumbnail && (
                      <BgImage src={course.thumbnail} className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" sizes="256px" />
                    )}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#ff7a3d]">
                        <Play className="ml-0.5 h-4 w-4 fill-current" />
                      </span>
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="text-[11px] font-semibold text-[#ff7a3d]">{course.category.name}</p>
                    <p className="mt-1 line-clamp-2 text-[15px] font-semibold leading-tight text-black">{course.title}</p>
                    <div className="mt-auto pt-3">
                      <div className="flex items-center justify-between text-[12px] font-medium text-black/55">
                        <span>{progress === 0 ? 'Pas encore commencé' : 'Progression'}</span>
                        <span className="font-black tabular-nums text-black">{progress}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 bg-[#f6f5f2]">
                        <div className="h-full bg-[#ff7a3d]" style={{ width: `${progress}%` }} />
                      </div>
                      <p className="mt-2.5 inline-flex items-center gap-1 text-[12px] font-semibold text-black transition-colors group-hover:text-[#ff7a3d]">
                        {progress === 0 ? 'Commencer' : 'Reprendre'}
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-45" />
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-3 text-[13px] font-semibold text-black">
            <span className="text-[20px] font-black leading-none text-emerald-600">{String(completed.length).padStart(2, '0')}</span>
            Terminés
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {completed.map((course) => (
              <div key={course.id} className="flex gap-4 bg-white p-4 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
                <Link href={`/course/${course.slug}`} className="relative h-24 w-32 shrink-0 overflow-hidden bg-[#f6f5f2]" aria-label={course.title}>
                  {course.thumbnail && <BgImage src={course.thumbnail} className="absolute inset-0" sizes="256px" />}
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                    <CheckCircle2 className="h-3 w-3" /> Terminé
                  </span>
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="text-[11px] font-semibold text-emerald-600">{course.category.name}</p>
                  <Link href={`/course/${course.slug}`} className="mt-1 line-clamp-2 text-[15px] font-semibold leading-tight text-black hover:text-[#ff7a3d]">
                    {course.title}
                  </Link>
                  <div className="mt-auto flex flex-wrap gap-2 pt-3">
                    <Link
                      href="/dashboard/certificates"
                      className="inline-flex h-[34px] items-center gap-1.5 bg-black px-3 text-[12px] font-semibold text-white transition-colors hover:bg-[#ff7a3d]"
                    >
                      <Award className="h-3.5 w-3.5" /> Mon certificat
                    </Link>
                    <Link
                      href={`/course/${course.slug}/learn`}
                      className="inline-flex h-[34px] items-center px-3 text-[12px] font-semibold text-black ring-1 ring-black/15 transition-colors hover:bg-[#f6f5f2]"
                    >
                      Revoir
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
