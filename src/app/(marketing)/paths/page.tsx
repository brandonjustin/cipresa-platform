import type { Metadata } from 'next';
import Link from 'next/link';
import { Milestone, BookOpen, ArrowUpRight } from 'lucide-react';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/animations/motion-components';
import { getPublishedLearningPaths } from '@/lib/data/learning-paths';
import { BgImage } from '@/components/ui/bg-image';

const levelLabels: Record<string, string> = { beginner: 'Débutant', intermediate: 'Intermédiaire', advanced: 'Avancé', all: 'Tous niveaux' };

export const metadata: Metadata = {
  title: 'Parcours d\'apprentissage',
  description: 'Suivez un parcours guidé de plusieurs formations, étape par étape et à votre rythme.',
};

// No per-request data (see src/lib/data/learning-paths.ts) — static + ISR
// instead of a live round trip on every navigation.
export const revalidate = 300;

export default async function LearningPathsPage() {
  const paths = await getPublishedLearningPaths();
  const totalCourses = paths.reduce((sum, path) => sum + path.courses.length, 0);

  return (
    <PageTransition>
      <div className="pt-[60px]">
        <section className="relative overflow-hidden bg-[#f6f5f2]">
          <div className="relative mx-auto max-w-[1520px] px-6 pb-16 pt-10 sm:px-10 lg:px-14 lg:pb-20 lg:pt-14">
            <StaggerContainer className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <div>
                <StaggerItem>
                  <span className="inline-flex items-center gap-2 bg-white px-3 py-1.5 text-[12px] font-semibold leading-none text-black ring-1 ring-black/10">
                    <Milestone className="h-3.5 w-3.5 text-[#ff7a3d]" />
                    Parcours d&apos;apprentissage
                  </span>
                </StaggerItem>
                <StaggerItem>
                  <h1 className="mt-6 font-display text-[36px] font-medium leading-[0.95] text-black sm:text-[50px] lg:text-[64px]">
                    Suivez un parcours
                    <span className="block">guidé</span>
                  </h1>
                </StaggerItem>
              </div>

              <StaggerItem className="max-w-[420px]">
                <p className="text-[15px] font-medium leading-[1.55] text-black">
                  Des séquences de cours pensées pour vous mener, étape par étape et à votre rythme, d&apos;un objectif à sa maîtrise.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-5">
                  <a
                    href="#parcours"
                    className="group inline-flex h-[42px] min-w-[154px] items-center justify-center gap-2 bg-black px-7 text-[13px] font-semibold text-white transition-colors hover:bg-cipresa-950"
                  >
                    Voir les parcours
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                  </a>
                  <Link
                    href="/courses"
                    className="text-[13px] font-semibold text-black underline-offset-4 transition-colors hover:text-[#ff7a3d] hover:underline"
                  >
                    Tous les cours
                  </Link>
                </div>
              </StaggerItem>
            </StaggerContainer>

            <StaggerContainer delay={0.2} className="mt-14 grid overflow-hidden bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:grid-cols-[1.05fr_0.95fr_0.95fr]">
              <StaggerItem className="relative min-h-[150px] overflow-hidden bg-[#ff7a3d] px-8 py-7 text-white">
                <div
                  aria-hidden="true"
                  className="absolute -bottom-24 right-6 h-[210px] w-[210px] rounded-full border border-white/35 opacity-70"
                  style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
                />
                <p className="relative text-[42px] font-black leading-none">{paths.length}</p>
                <p className="relative mt-1 max-w-[220px] text-[14px] font-medium leading-tight">
                  Parcours {paths.length > 1 ? 'disponibles' : 'disponible'}
                </p>
                <Milestone className="absolute right-[30%] top-10 h-5 w-5 text-white" />
              </StaggerItem>

              <StaggerItem className="border-t border-gray-200 px-7 py-7 md:border-l md:border-t-0 lg:px-8">
                <p className="text-[34px] font-black leading-none text-black">{totalCourses}</p>
                <div className="my-5 h-px bg-gray-200" />
                <p className="max-w-[230px] text-[12px] font-medium leading-tight text-black">
                  Cours organises en sequences, du premier pas jusqu&apos;a la maitrise
                </p>
              </StaggerItem>

              <StaggerItem className="border-t border-gray-200 md:border-l md:border-t-0">
                <a href="#parcours" className="group flex h-full flex-col justify-between gap-6 px-7 py-7 transition-colors duration-500 hover:bg-black lg:px-8">
                  <p className="text-[18px] font-semibold leading-tight text-black transition-colors duration-500 group-hover:text-white">
                    A votre rythme
                  </p>
                  <div className="flex items-end justify-between gap-5">
                    <p className="max-w-[210px] text-[12px] font-medium leading-tight text-black transition-colors duration-500 group-hover:text-white/80">
                      Progressez etape par etape, un cours apres l&apos;autre
                    </p>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff7a3d] text-white transition-transform duration-500 group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </a>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        <section id="parcours" className="scroll-mt-20 bg-white">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <StaggerContainer className="grid gap-8 border-t border-black pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <StaggerItem>
                <h2 className="font-display text-[28px] font-medium leading-[0.95] text-black sm:text-[38px] lg:text-[46px]">
                  Choisissez
                  <span className="block">votre parcours</span>
                </h2>
              </StaggerItem>
              <StaggerItem className="max-w-[420px]">
                <p className="text-[15px] font-medium leading-[1.55] text-black">
                  Chaque parcours regroupe plusieurs cours dans un ordre precis, pour atteindre un objectif concret.
                </p>
              </StaggerItem>
            </StaggerContainer>

            {paths.length === 0 ? (
              <div className="mt-14 flex flex-col items-center bg-[#f6f5f2] px-6 py-20 text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ff7a3d]/10 text-[#ff7a3d]">
                  <Milestone className="h-8 w-8 stroke-[1.6]" />
                </span>
                <h3 className="mt-6 font-display text-[24px] font-medium leading-tight text-black">Aucun parcours disponible pour le moment</h3>
                <p className="mt-2 text-[13px] font-medium text-black/60">De nouveaux parcours seront bientôt proposés.</p>
                <Link
                  href="/courses"
                  className="group mt-7 inline-flex h-[42px] items-center gap-2 bg-black px-6 text-[13px] font-semibold text-white transition-colors hover:bg-[#ff7a3d]"
                >
                  Voir les cours
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                </Link>
              </div>
            ) : (
              <StaggerContainer delay={0.1} className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {paths.map((path, index) => (
                  <StaggerItem key={path.id} className="h-full">
                    <Link
                      href={`/paths/${path.slug}`}
                      className="group relative flex h-full flex-col bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200 transition-shadow duration-500 hover:shadow-[0_24px_60px_rgba(0,0,0,0.1)]"
                    >
                      <div className="relative h-60 overflow-hidden bg-[#f6f5f2]">
                        {path.thumbnail ? (
                          <BgImage src={path.thumbnail} className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" role="img" aria-label={path.title} />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-[#ff7a3d]/40">
                            <Milestone className="h-14 w-14 stroke-[1.2]" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                        <span className="absolute left-5 top-5 bg-white px-3 py-1.5 text-[12px] font-semibold leading-none text-black">
                          {levelLabels[path.level] ?? 'Tous niveaux'}
                        </span>
                        <p className="absolute bottom-5 left-5 text-[34px] font-black leading-none text-white">
                          {String(index + 1).padStart(2, '0')}
                        </p>
                        <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[#ff7a3d] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                      </div>

                      <div className="flex flex-1 flex-col px-6 pb-6 pt-6">
                        <p className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#ff7a3d]">
                          <BookOpen className="h-3.5 w-3.5" />
                          {path.courses.length} cours
                        </p>
                        <h3 className="mt-2 text-[18px] font-semibold leading-tight text-black transition-colors duration-300 group-hover:text-[#ff7a3d]">
                          {path.title}
                        </h3>
                        <p className="mt-3 line-clamp-3 text-[13px] font-medium leading-[1.5] text-black/70">{path.description}</p>

                        <div className="mt-auto pt-6">
                          <div className="mb-5 h-px bg-gray-200" />
                          <div className="flex items-center justify-between gap-5">
                            <span className="text-[13px] font-semibold text-black">Découvrir le parcours</span>
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff7a3d] text-white transition-all duration-500 group-hover:rotate-45 group-hover:bg-black">
                              <ArrowUpRight className="h-4 w-4" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
