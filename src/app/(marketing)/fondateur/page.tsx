import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Leaf, ArrowUpRight, Quote, MapPin, Sprout, Users } from 'lucide-react';
import { PageTransition, AnimatedSection, StaggerContainer, StaggerItem } from '@/components/animations/motion-components';
import { JsonLd } from '@/components/seo/json-ld';
import {
  founder,
  founderStats,
  founderTimeline,
  founderSetbacks,
  founderLessons,
  founderExpertise,
  ecosystem,
  coreValues,
  founderFacts,
} from '@/lib/utils/founder';

export const metadata: Metadata = {
  title: 'Kana Evariste, fondateur & CEO',
  description:
    'Ingénieur agronome, promoteur et CEO de CIPRESA Consulting SARL, PCA de SOCAPRA et formateur international : le parcours de Kana Evariste, de Bafou aux 870 hectares réalisés par CIPRESA.',
  openGraph: {
    type: 'profile',
    title: 'Kana Evariste, fondateur & CEO de CIPRESA Consulting',
    description: founder.quote,
  },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: founder.name,
  alternateName: founder.fullName,
  jobTitle: 'Promoteur et CEO',
  birthDate: founder.birthDate,
  birthPlace: 'Ndoh Djuttitsa, Nkong-Ni, Menoua, Cameroun',
  url: `${siteUrl}/fondateur`,
  worksFor: { '@type': 'Organization', name: 'CIPRESA Consulting SARL', url: siteUrl },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Faculté d’Agronomie et des Sciences Agricoles, Université de Dschang' },
  knowsAbout: ['Agronomie', 'Mécanisation agricole', 'Irrigation', 'Arboriculture fruitière', 'Pépinière', 'Management agricole'],
};

const dotPattern = {
  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)',
  backgroundSize: '12px 12px',
};

function SectionHeading({ title, line2, intro }: { title: string; line2: string; intro: string }) {
  return (
    <StaggerContainer className="grid gap-8 border-t border-black pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
      <StaggerItem>
        <h2 className="font-display text-[28px] font-medium leading-[0.95] text-black sm:text-[38px] lg:text-[46px]">
          {title}
          <span className="block">{line2}</span>
        </h2>
      </StaggerItem>
      <StaggerItem className="max-w-[420px]">
        <p className="text-[15px] font-medium leading-[1.55] text-black">{intro}</p>
      </StaggerItem>
    </StaggerContainer>
  );
}

export default function FounderPage() {
  return (
    <PageTransition>
      <JsonLd data={personJsonLd} />
      <div className="pt-[60px]">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#f6f5f2]">
          <div className="relative mx-auto max-w-[1520px] px-6 pb-16 pt-10 sm:px-10 lg:px-14 lg:pb-20 lg:pt-14">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
              <StaggerContainer>
                <StaggerItem>
                  <span className="inline-flex items-center gap-2 bg-white px-3 py-1.5 text-[12px] font-semibold leading-none text-black ring-1 ring-black/10">
                    <Leaf className="h-3.5 w-3.5 text-[#ff7a3d]" />
                    Le fondateur
                  </span>
                </StaggerItem>
                <StaggerItem>
                  <h1 className="mt-6 font-display text-[40px] font-medium leading-[0.95] text-black sm:text-[56px] lg:text-[72px]">
                    Kana
                    <span className="block">Evariste</span>
                  </h1>
                </StaggerItem>
                <StaggerItem>
                  <p className="mt-5 text-[14px] font-semibold text-[#ff7a3d]">{founder.role}</p>
                  <p className="mt-1 text-[13px] font-medium text-black/60">
                    {founder.shortTitle} • PCA de SOCAPRA
                  </p>
                </StaggerItem>
                <StaggerItem>
                  <p className="mt-8 max-w-[620px] text-[17px] font-medium leading-[1.6] text-black">{founder.summary}</p>
                </StaggerItem>
                <StaggerItem>
                  <div className="mt-8 flex flex-wrap items-center gap-5">
                    <Link
                      href="/contact"
                      className="group inline-flex h-[42px] min-w-[154px] items-center justify-center gap-2 bg-black px-7 text-[13px] font-semibold text-white transition-colors hover:bg-cipresa-950"
                    >
                      Inviter Kana Evariste
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                    </Link>
                    <a
                      href="#parcours"
                      className="text-[13px] font-semibold text-black underline-offset-4 transition-colors hover:text-[#ff7a3d] hover:underline"
                    >
                      Découvrir son parcours
                    </a>
                  </div>
                </StaggerItem>
              </StaggerContainer>

              <AnimatedSection direction="right">
                <figure className="relative aspect-[4/5] w-full overflow-hidden bg-[#ff7a3d] text-white shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
                  {founder.portrait ? (
                    <Image
                      src={founder.portrait}
                      alt={`Portrait de ${founder.name}`}
                      fill
                      priority
                      sizes="(min-width: 1024px) 38vw, 100vw"
                      className="object-cover object-top"
                    />
                  ) : (
                    <>
                      <div aria-hidden="true" className="absolute -bottom-24 -right-16 h-[320px] w-[320px] rounded-full border border-white/35 opacity-70" style={dotPattern} />
                      <span aria-hidden="true" className="absolute left-8 top-8 font-display text-[120px] font-medium leading-none text-white/90 sm:text-[160px]">
                        {founder.initials}
                      </span>
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-7">
                    <Quote className="h-6 w-6 text-[#ff7a3d]" />
                    <p className="mt-3 font-display text-[22px] font-medium leading-[1.15] sm:text-[26px]">« {founder.quote} »</p>
                  </figcaption>
                </figure>
              </AnimatedSection>
            </div>

            {/* Key figures */}
            <StaggerContainer delay={0.2} className="mt-14 grid grid-cols-2 gap-px overflow-hidden bg-gray-200 shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200 md:grid-cols-3 lg:grid-cols-6">
              {founderStats.map((s, i) => (
                <StaggerItem
                  key={s.label}
                  className={`relative flex min-h-[150px] flex-col justify-between overflow-hidden px-6 py-6 ${i === 0 ? 'bg-[#ff7a3d] text-white' : 'bg-white text-black'}`}
                >
                  <p className="text-[28px] font-black leading-none sm:text-[32px]">{s.value}</p>
                  <p className={`mt-6 text-[12px] font-medium leading-tight ${i === 0 ? 'text-white/90' : 'text-black/70'}`}>{s.label}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Conviction */}
        <section className="bg-black text-white">
          <div className="mx-auto max-w-[1520px] px-6 py-16 sm:px-10 lg:px-14 lg:py-20">
            <AnimatedSection className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-16">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#ff7a3d]">Sa conviction</p>
              <p className="max-w-[980px] font-display text-[24px] font-medium leading-[1.2] sm:text-[32px] lg:text-[40px]">
                {founder.conviction}{' '}
                <span className="text-white/50">Toute son œuvre répond à cette exigence.</span>
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Timeline */}
        <section id="parcours" className="scroll-mt-20 bg-white">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <SectionHeading
              title="De l’agronome"
              line2="au dirigeant"
              intro="D’un quart d’hectare à Bafou à plus de 870 hectares réalisés : une trajectoire bâtie en moins de dix ans, par paliers."
            />
            <StaggerContainer delay={0.1} className="mt-14 grid gap-px overflow-hidden bg-gray-200 ring-1 ring-gray-200 sm:grid-cols-2 lg:grid-cols-3">
              {founderTimeline.map((step, i) => (
                <StaggerItem key={step.title} className="group relative flex min-h-[230px] flex-col bg-white px-7 py-7">
                  <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#ff7a3d] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                  <div className="flex items-center justify-between gap-4">
                    <span className="bg-[#ff7a3d]/10 px-2.5 py-1 text-[12px] font-semibold text-[#ff7a3d]">{step.date}</span>
                    <span className="text-[13px] font-black text-black/25">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="mt-8 text-[18px] font-semibold leading-tight text-black">{step.title}</h3>
                  <p className="mt-3 text-[13px] font-medium leading-[1.55] text-black/70">{step.text}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Setbacks */}
        <section className="bg-[#f6f5f2]">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <SectionHeading
              title="Les épreuves"
              line2="comme école"
              intro="Aucune trajectoire d’envergure n’est exempte d’épreuves. Kana Evariste en a connu plusieurs, et en parle sans détour."
            />
            <div className="mt-14 grid gap-5 lg:grid-cols-[1fr_1fr_0.9fr]">
              {founderSetbacks.map((s) => (
                <AnimatedSection key={s.title} className="bg-white px-7 py-8 shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200">
                  <h3 className="text-[18px] font-semibold leading-tight text-black">{s.title}</h3>
                  <div className="my-5 h-px bg-gray-200" />
                  <p className="text-[13px] font-medium leading-[1.6] text-black/70">{s.text}</p>
                </AnimatedSection>
              ))}
              <AnimatedSection className="relative overflow-hidden bg-[#ff7a3d] px-7 py-8 text-white">
                <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-12 h-[210px] w-[210px] rounded-full border border-white/35 opacity-70" style={dotPattern} />
                <p className="relative text-[18px] font-semibold leading-tight">Ce que ces échecs lui ont enseigné</p>
                <ul className="relative mt-6 space-y-3">
                  {founderLessons.map((l) => (
                    <li key={l} className="flex items-start gap-3 text-[14px] font-medium leading-snug">
                      <Sprout className="mt-0.5 h-4 w-4 shrink-0" />
                      {l}
                    </li>
                  ))}
                </ul>
                <p className="relative mt-6 text-[12px] font-medium leading-snug text-white/85">
                  Une lucidité assumée avec humilité, devenue l’un de ses atouts de dirigeant.
                </p>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Expertise */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <SectionHeading
              title="Domaines"
              line2="d’expertise"
              intro="Ingénieur de terrain autant que stratège : toute la chaîne qui mène d’une idée à un verger productif."
            />
            <StaggerContainer delay={0.1} className="mt-14 grid gap-px overflow-hidden bg-gray-200 ring-1 ring-gray-200 sm:grid-cols-2 lg:grid-cols-4">
              {founderExpertise.map((e, i) => (
                <StaggerItem key={e.title} className="group flex min-h-[200px] flex-col bg-white px-6 py-7 transition-colors duration-500 hover:bg-[#f6f5f2]">
                  <p className="text-[13px] font-black text-[#ff7a3d]">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="mt-6 text-[17px] font-semibold leading-tight text-black">{e.title}</h3>
                  <p className="mt-3 text-[13px] font-medium leading-[1.55] text-black/70">{e.text}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Ecosystem */}
        <section className="bg-[#f6f5f2]">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <SectionHeading
              title="Un écosystème"
              line2="pour structurer l’agriculture"
              intro="Cabinet, coopérative, école, outil numérique, équipement et plaidoyer : chaque structure répond à un maillon de la chaîne."
            />
            <StaggerContainer delay={0.1} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {ecosystem.map((item) => {
                const body = (
                  <>
                    <span className="self-start bg-[#f6f5f2] px-2.5 py-1 text-[11px] font-semibold leading-none text-black">{item.tag}</span>
                    <h3 className="mt-6 text-[18px] font-semibold leading-tight text-black">{item.name}</h3>
                    <p className="mt-3 flex-1 text-[13px] font-medium leading-[1.55] text-black/70">{item.text}</p>
                    {'href' in item && (
                      <span className="mt-6 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#ff7a3d]">
                        En savoir plus <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-45" />
                      </span>
                    )}
                  </>
                );
                const cls = 'group flex h-full flex-col bg-white px-6 py-7 shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200';
                return (
                  <StaggerItem key={item.name} className="h-full">
                    {'href' in item ? (
                      <Link href={item.href} className={`${cls} transition-shadow duration-500 hover:shadow-[0_24px_60px_rgba(0,0,0,0.1)]`}>
                        {body}
                      </Link>
                    ) : (
                      <div className={cls}>{body}</div>
                    )}
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
            <AnimatedSection className="mt-8 flex flex-wrap items-center gap-3 text-[13px] font-medium text-black/70">
              <MapPin className="h-4 w-4 text-[#ff7a3d]" />
              Établi au Cameroun et en Côte d’Ivoire • Pépinières à Yaoundé, Bafoussam et Djombe • République du Congo dès janvier 2027
            </AnimatedSection>
          </div>
        </section>

        {/* Vision & values */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <SectionHeading
              title="Vision"
              line2="et valeurs"
              intro="Faire du Cameroun un hub agricole régional, porté par une production semencière de qualité, des infrastructures modernes et une gouvernance exemplaire."
            />
            <StaggerContainer delay={0.1} className="mt-14 grid gap-px overflow-hidden bg-gray-200 ring-1 ring-gray-200 sm:grid-cols-2 lg:grid-cols-4">
              {coreValues.map((v, i) => (
                <StaggerItem
                  key={v.title}
                  className={`relative flex min-h-[220px] flex-col overflow-hidden px-7 py-8 ${i === 0 ? 'bg-[#ff7a3d] text-white' : 'bg-white text-black'}`}
                >
                  {i === 0 && <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-12 h-[210px] w-[210px] rounded-full border border-white/35 opacity-70" style={dotPattern} />}
                  <p className="relative text-[34px] font-black leading-none">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="relative mt-auto pt-10 text-[20px] font-semibold leading-tight">{v.title}</h3>
                  <p className={`relative mt-2 text-[13px] font-medium leading-[1.55] ${i === 0 ? 'text-white/90' : 'text-black/70'}`}>{v.text}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* The man + key facts */}
        <section className="bg-[#f6f5f2]">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <div className="grid gap-12 border-t border-black pt-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
              <AnimatedSection direction="left">
                <h2 className="font-display text-[28px] font-medium leading-[0.95] text-black sm:text-[38px] lg:text-[46px]">
                  L’homme derrière
                  <span className="block">le dirigeant</span>
                </h2>
                <div className="mt-8 max-w-[560px] space-y-5">
                  <p className="text-[16px] font-medium leading-[1.65] text-black">
                    Époux et père de trois enfants, Kana Evariste puise dans sa vie de famille l’équilibre et la motivation qui soutiennent son engagement.
                  </p>
                  <p className="text-[15px] font-medium leading-[1.7] text-black/70">
                    Les générations à venir sont, pour lui, la raison d’être de chaque hectare planté et de chaque structure bâtie : léguer un continent capable de se nourrir, d’innover et de prospérer par ses propres forces.
                  </p>
                  <p className="text-[15px] font-medium leading-[1.7] text-black/70">
                    Ingénieur de formation, manager par vocation et entrepreneur par conviction, il incarne une génération de bâtisseurs qui osent semer aujourd’hui les graines de la prospérité de demain.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection direction="right">
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-black/50">Repères</h3>
                <dl className="mt-5 divide-y divide-gray-200 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200">
                  {founderFacts.map(([k, v]) => (
                    <div key={k} className="grid gap-1 px-6 py-4 sm:grid-cols-[140px_1fr] sm:gap-6">
                      <dt className="text-[12px] font-semibold text-[#ff7a3d]">{k}</dt>
                      <dd className="text-[13px] font-medium leading-snug text-black">{v}</dd>
                    </div>
                  ))}
                </dl>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-black text-white">
          <div className="mx-auto flex max-w-[1520px] flex-col gap-8 px-6 py-16 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-20">
            <div>
              <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#ff7a3d]">
                <Users className="h-4 w-4" /> Master classes • Conférences • Accompagnement
              </p>
              <p className="mt-4 max-w-[720px] font-display text-[26px] font-medium leading-[1.1] sm:text-[36px]">
                Organiser une master class ou structurer votre projet agricole avec CIPRESA.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="group inline-flex h-[46px] items-center justify-center gap-2 bg-[#ff7a3d] px-7 text-[13px] font-semibold text-white transition-colors hover:bg-[#e8662b]">
                Nous contacter
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              </Link>
              <Link href="/about" className="inline-flex h-[46px] items-center justify-center px-7 text-[13px] font-semibold text-white ring-1 ring-white/30 transition-colors hover:bg-white hover:text-black">
                Découvrir CIPRESA
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
