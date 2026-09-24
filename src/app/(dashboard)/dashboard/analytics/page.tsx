import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Clock, BookOpen, Award, TrendingUp, ArrowUpRight, BarChart3, CheckCircle2 } from 'lucide-react';
import { getVerifiedUserId } from '@/lib/supabase/server';
import { getCoursesByIds, getUserEnrollments } from '@/lib/data/courses';
import { BgImage } from '@/components/ui/bg-image';

export default async function AnalyticsPage() {
  // Middleware already verified the session for this route and forwarded the id.
  const userId = getVerifiedUserId();
  const user = userId ? { id: userId } : null;
  if (!user) redirect('/auth/login?next=/dashboard/analytics');

  const enrollments = await getUserEnrollments(user.id);
  const courses = await getCoursesByIds(enrollments.map((e) => e.courseId));
  const progressByCourse = Object.fromEntries(enrollments.map((e) => [e.courseId, e]));

  const completedCount = enrollments.filter((e) => e.completedAt).length;
  const inProgressCount = enrollments.length - completedCount;
  const totalHoursLearned = courses.reduce(
    (sum, c) => sum + (c.totalHours * (progressByCourse[c.id]?.progress ?? 0)) / 100,
    0
  );
  const averageProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
    : 0;

  const stats = [
    { icon: BookOpen, label: 'Cours en cours', value: inProgressCount.toString() },
    { icon: Award, label: 'Cours terminés', value: completedCount.toString() },
    { icon: Clock, label: 'Heures apprises', value: `${Math.round(totalHoursLearned)}h` },
    { icon: TrendingUp, label: 'Progression moyenne', value: `${averageProgress}%` },
  ];

  // In-progress first (least advanced at the top), finished courses last.
  const sortedCourses = [...courses].sort((a, b) => {
    const ea = progressByCourse[a.id];
    const eb = progressByCourse[b.id];
    const doneA = ea?.completedAt ? 1 : 0;
    const doneB = eb?.completedAt ? 1 : 0;
    if (doneA !== doneB) return doneA - doneB;
    return (ea?.progress ?? 0) - (eb?.progress ?? 0);
  });

  return (
    <div className="space-y-6">
      {/* Stats strip */}
      <div className="grid grid-cols-2 overflow-hidden bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)] lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={
              i === 0
                ? 'relative overflow-hidden bg-[#ff7a3d] px-6 py-6 text-white'
                : 'border-l border-t border-gray-200 px-6 py-6 text-black lg:border-t-0 [&:nth-child(2)]:border-t-0 [&:nth-child(3)]:border-l-0 lg:[&:nth-child(3)]:border-l'
            }
          >
            {i === 0 && (
              <div
                aria-hidden="true"
                className="absolute -bottom-16 -right-10 h-[140px] w-[140px] rounded-full border border-white/35 opacity-70"
                style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '10px 10px' }}
              />
            )}
            <stat.icon className={i === 0 ? 'relative h-5 w-5 text-white' : 'relative h-5 w-5 text-[#ff7a3d]'} />
            <p className="relative mt-5 text-[34px] font-black leading-none">{stat.value}</p>
            <p className={i === 0 ? 'relative mt-2 text-[12px] font-medium text-white/85' : 'relative mt-2 text-[12px] font-medium text-black/55'}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Per-course progress */}
      <section className="bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-gray-200 pb-4">
          <h2 className="font-display text-[22px] font-medium leading-none text-black sm:text-[26px]">Progression par cours</h2>
          {courses.length > 0 && (
            <p className="text-[12px] font-medium text-black/50">
              {courses.length} formation{courses.length > 1 ? 's' : ''} suivie{courses.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {courses.length === 0 ? (
          <div className="mt-6 flex flex-col items-center bg-[#f6f5f2] px-6 py-12 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ff7a3d]/10 text-[#ff7a3d]">
              <BarChart3 className="h-6 w-6" />
            </span>
            <p className="mt-4 text-[15px] font-semibold text-black">Aucune formation en cours pour le moment.</p>
            <p className="mt-1 max-w-sm text-[13px] font-medium text-black/55">
              Vos statistiques apparaîtront ici dès que vous commencerez une formation.
            </p>
            <Link
              href="/courses"
              className="group mt-6 inline-flex h-[42px] items-center gap-2 bg-black px-6 text-[13px] font-semibold text-white transition-colors hover:bg-[#ff7a3d]"
            >
              Explorer les formations
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
            </Link>
          </div>
        ) : (
          <ul className="mt-2">
            {sortedCourses.map((course) => {
              const enrollment = progressByCourse[course.id];
              const progress = enrollment?.progress ?? 0;
              const done = Boolean(enrollment?.completedAt);
              return (
                <li key={course.id}>
                  <Link
                    href={done ? `/course/${course.slug}` : `/course/${course.slug}/learn`}
                    className="group flex items-center gap-4 border-b border-gray-100 py-4 last:border-0"
                  >
                    <BgImage src={course.thumbnail} className="h-12 w-16 shrink-0 bg-[#f6f5f2]" sizes="160px" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-[14px] font-semibold text-black transition-colors group-hover:text-[#ff7a3d]">{course.title}</p>
                        {done ? (
                          <span className="inline-flex shrink-0 items-center gap-1 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Terminé
                          </span>
                        ) : (
                          <span className="shrink-0 text-[13px] font-black tabular-nums text-black">{progress}%</span>
                        )}
                      </div>
                      <div className="mt-2.5 h-1.5 bg-[#f6f5f2]">
                        <div
                          className={done ? 'h-full bg-emerald-500' : 'h-full bg-[#ff7a3d] transition-all duration-700'}
                          style={{ width: `${done ? 100 : progress}%` }}
                        />
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-black/25 transition-all duration-300 group-hover:rotate-45 group-hover:text-[#ff7a3d]" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
