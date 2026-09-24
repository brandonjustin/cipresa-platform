'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen, Clock, Award, TrendingUp, User, ShoppingBag,
  Play, Star, GraduationCap, Milestone, ArrowUpRight, Users,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { Course } from '@/types';
import type { NextPathCourse } from '@/lib/data/learning-paths';
import { BgImage } from '@/components/ui/bg-image';

const tile = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 90, damping: 20 } },
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };

interface DashboardViewProps {
  enrolledCourses: Course[];
  progressByCourse: Record<string, number>;
  popularCourses: Course[];
  nextPathCourse: NextPathCourse | null;
  totalHoursLearned: number;
  completedCourses: number;
}

export function DashboardView({
  enrolledCourses,
  progressByCourse,
  popularCourses,
  nextPathCourse,
  totalHoursLearned,
  completedCourses,
}: DashboardViewProps) {
  const hasEnrolledCourses = enrolledCourses.length > 0;
  // enrolledCourses only holds in-progress courses (see dashboard/page.tsx),
  // so a user who finished everything would have hasEnrolledCourses=false
  // too — the welcome hero should only show for someone with zero activity
  // ever, not someone who's caught up.
  const isNewUser = enrolledCourses.length === 0 && completedCourses === 0;

  const progressValues = Object.values(progressByCourse);
  const averageProgress = progressValues.length > 0 ? Math.round(progressValues.reduce((a, b) => a + b, 0) / progressValues.length) : 0;

  const quickActions = [
    {
      icon: BookOpen,
      label: hasEnrolledCourses ? 'Continuer un cours' : 'Trouver un cours',
      href: hasEnrolledCourses ? `/course/${enrolledCourses[0].slug}/learn` : '/courses',
    },
    { icon: Award, label: 'Voir mes certificats', href: '/dashboard/certificates' },
    { icon: User, label: 'Compléter mon profil', href: '/dashboard/settings' },
    { icon: ShoppingBag, label: 'Mes commandes', href: '/dashboard/orders' },
  ];

  const stats = [
    { icon: BookOpen, label: 'Cours en cours', value: String(enrolledCourses.length) },
    { icon: Award, label: 'Cours terminés', value: String(completedCourses) },
    { icon: Clock, label: 'Heures apprises', value: `${totalHoursLearned}h` },
    { icon: TrendingUp, label: 'Progression moyenne', value: `${averageProgress}%` },
  ];

  return (
    <div className="space-y-6">
      {/* Quick actions */}
      <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-2 gap-px overflow-hidden bg-gray-200 ring-1 ring-gray-200 lg:grid-cols-4">
        {quickActions.map((action) => (
          <motion.div key={action.label} variants={tile}>
            <Link
              href={action.href}
              className="group flex h-full items-center gap-3 bg-white px-4 py-4 transition-colors duration-300 hover:bg-black"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff7a3d]/10 text-[#ff7a3d] transition-colors duration-300 group-hover:bg-[#ff7a3d] group-hover:text-white">
                <action.icon className="h-4 w-4" />
              </span>
              <span className="flex-1 text-[13px] font-semibold leading-tight text-black transition-colors duration-300 group-hover:text-white">{action.label}</span>
              <ArrowUpRight className="hidden h-4 w-4 shrink-0 text-black/25 transition-all duration-300 group-hover:rotate-45 group-hover:text-white sm:block" />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats or welcome */}
      {!isNewUser ? (
        <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-2 overflow-hidden bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)] lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={tile}
              className={cn(
                'relative overflow-hidden px-6 py-6',
                i === 0 ? 'bg-[#ff7a3d] text-white' : 'border-l border-t border-gray-200 text-black lg:border-t-0 [&:nth-child(2)]:border-t-0 [&:nth-child(3)]:border-l-0 lg:[&:nth-child(3)]:border-l'
              )}
            >
              {i === 0 && (
                <div
                  aria-hidden="true"
                  className="absolute -bottom-16 -right-10 h-[140px] w-[140px] rounded-full border border-white/35 opacity-70"
                  style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '10px 10px' }}
                />
              )}
              <stat.icon className={cn('relative h-5 w-5', i === 0 ? 'text-white' : 'text-[#ff7a3d]')} />
              <p className="relative mt-5 text-[34px] font-black leading-none">{stat.value}</p>
              <p className={cn('relative mt-2 text-[12px] font-medium', i === 0 ? 'text-white/85' : 'text-black/55')}>{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden bg-[#ff7a3d] p-7 text-white sm:p-9"
        >
          <div
            aria-hidden="true"
            className="absolute -bottom-28 -right-14 h-[280px] w-[280px] rounded-full border border-white/35 opacity-70"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
          />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[#ff7a3d]">
              <GraduationCap className="h-7 w-7" />
            </span>
            <div className="flex-1">
              <h2 className="font-display text-[26px] font-medium leading-[1.05] sm:text-[30px]">Bienvenue sur CIPRESA !</h2>
              <p className="mt-2 max-w-xl text-[14px] font-medium leading-[1.6] text-white/90">
                Votre tableau de bord se remplira au fil de vos formations et de votre progression. Commencez par explorer nos contenus pour démarrer.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/courses"
                  className="group inline-flex h-[42px] items-center gap-2 bg-black px-6 text-[13px] font-semibold text-white transition-colors hover:bg-white hover:text-black"
                >
                  Explorer les formations
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                </Link>
                <Link
                  href="/marketplace"
                  className="inline-flex h-[42px] items-center bg-white px-6 text-[13px] font-semibold text-black transition-colors hover:bg-black hover:text-white"
                >
                  Voir la boutique
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Next step in a learning path */}
      {nextPathCourse && (
        <Link
          href={`/course/${nextPathCourse.course.slug}`}
          className="group relative flex items-center gap-4 overflow-hidden bg-black px-6 py-5 text-white transition-colors hover:bg-[#1a1a1a]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff7a3d]">
            <Milestone className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-[#ff7a3d]">Parcours · {nextPathCourse.pathTitle}</p>
            <p className="mt-0.5 truncate text-[15px] font-semibold">Prochaine étape : {nextPathCourse.course.title}</p>
          </div>
          <ArrowUpRight className="h-5 w-5 shrink-0 text-white/60 transition-all duration-300 group-hover:rotate-45 group-hover:text-white" />
        </Link>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Continue learning */}
        <section className="bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
          <div className="flex items-end justify-between gap-4 border-b border-gray-200 pb-4">
            <h2 className="font-display text-[22px] font-medium leading-none text-black">Continuer l&apos;apprentissage</h2>
            <Link href="/dashboard/my-courses" className="shrink-0 text-[12px] font-semibold text-[#ff7a3d] hover:underline">
              Voir tout
            </Link>
          </div>
          {hasEnrolledCourses ? (
            <ul className="mt-2">
              {enrolledCourses.map((course) => {
                const progress = progressByCourse[course.id] ?? 0;
                return (
                  <li key={course.id}>
                    <Link href={`/course/${course.slug}/learn`} className="group flex items-center gap-4 border-b border-gray-100 py-3.5 last:border-0">
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden bg-[#f6f5f2]">
                        {course.thumbnail && <BgImage src={course.thumbnail} className="absolute inset-0" sizes="160px" />}
                        <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <Play className="h-4 w-4 fill-white text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-semibold text-black transition-colors group-hover:text-[#ff7a3d]">{course.title}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="h-1.5 flex-1 bg-[#f6f5f2]">
                            <motion.div
                              className="h-full bg-[#ff7a3d]"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </div>
                          <span className="w-9 text-right text-[12px] font-bold tabular-nums text-black">{progress}%</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-5 flex flex-col items-center bg-[#f6f5f2] px-6 py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff7a3d]/10 text-[#ff7a3d]">
                <GraduationCap className="h-6 w-6" />
              </span>
              <p className="mt-4 text-[14px] font-semibold text-black">Commencez votre première formation</p>
              <Link
                href="/courses"
                className="group mt-5 inline-flex h-[40px] items-center gap-2 bg-black px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#ff7a3d]"
              >
                Explorer les cours
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </div>
          )}
        </section>

        {/* Recommendations */}
        <section className="bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
          <div className="flex items-end justify-between gap-4 border-b border-gray-200 pb-4">
            <h2 className="font-display text-[22px] font-medium leading-none text-black">Recommandations</h2>
            <Link href="/courses" className="shrink-0 text-[12px] font-semibold text-[#ff7a3d] hover:underline">
              Voir tout
            </Link>
          </div>
          {popularCourses.length > 0 ? (
            <ul className="mt-2">
              {popularCourses.map((course) => (
                <li key={course.id}>
                  <Link href={`/course/${course.slug}`} className="group flex items-center gap-4 border-b border-gray-100 py-3.5 last:border-0">
                    <BgImage src={course.thumbnail} className="h-12 w-16 shrink-0 bg-[#f6f5f2]" sizes="160px" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold text-black transition-colors group-hover:text-[#ff7a3d]">{course.title}</p>
                      <div className="mt-1 flex items-center gap-3 text-[12px] font-medium text-black/55">
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-[#ff7a3d] text-[#ff7a3d]" />
                          <span className="font-semibold text-black">{course.rating > 0 ? course.rating.toFixed(1) : '—'}</span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {course.totalStudents} étudiant{course.totalStudents > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-black/25 transition-all duration-300 group-hover:rotate-45 group-hover:text-[#ff7a3d]" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 bg-[#f6f5f2] px-6 py-10 text-center text-[13px] font-medium text-black/55">Aucune recommandation pour le moment.</p>
          )}
        </section>
      </div>
    </div>
  );
}
