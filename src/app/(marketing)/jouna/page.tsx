import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Leaf, ArrowUpRight, CalendarDays, MapPin, Radio, Sparkles, Mic } from 'lucide-react';
import { PageTransition, AnimatedSection, StaggerContainer, StaggerItem } from '@/components/animations/motion-components';
import { JsonLd } from '@/components/seo/json-ld';
import { company } from '@/lib/utils/company';
import {
  jouna,
  jounaResults,
  jounaPanels,
  jounaExhibitors,
  jounaCoPromoters,
  jounaInstitutions,
  jounaCommittee,
  jounaMedia,
  jouna2027Goals,
  jounaGallery,
} from '@/lib/utils/jouna';

export const metadata: Metadata = {
  title: 'JOUNA 2026 — Journée Nationale de l’Arbre',
  description:
    'Bilan de la Journée Nationale de l’Arbre 2026 au Palais des Congrès de Yaoundé : 500 agriculteurs, 4 panels, 21 intervenants, 11 stands et les objectifs JOUNA 2027.',
  openGraph: {
    title: 'JOUNA 2026 — Journée Nationale de l’Arbre',
    description: `« ${jouna.theme} » — ${jouna.date}, ${jouna.venue}.`,
    images: ['/images/jouna/photo-de-famille.jpg'],
  },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const eventJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: `${jouna.name} ${jouna.edition}`,
  description: jouna.intro,
  startDate: jouna.isoDate,
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: jouna.venue,
    address: { '@type': 'PostalAddress', addressLocality: 'Yaoundé', addressCountry: 'CM' },
  },
  image: [`${siteUrl}/images/jouna/photo-de-famille.jpg`],
  organizer: { '@type': 'Organization', name: company.name, url: siteUrl },
  performer: { '@type': 'Person', name: 'Kana Evariste', url: `${siteUrl}/fondateur` },
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
      <StaggerItem className="max-w-[440px]">
        <p className="text-[15px] font-medium leading-[1.55] text-black">{intro}</p>
      </StaggerItem>
    </StaggerContainer>
  );
}

export default function JounaPage() {
  return (
    <PageTransition>
      <JsonLd data={eventJsonLd} />
      <div className="pt-[60px]">
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-black text-white">
          <Image src="/images/jouna/photo-de-famille.jpg" alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-35" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/70 to-black/30" />
          <div className="mx-auto max-w-[1520px] px-6 pb-16 pt-14 sm:px-10 lg:px-14 lg:pb-20 lg:pt-20">
            <StaggerContainer>
              <StaggerItem>
                <span className="inline-flex items-center gap-2 bg-white px-3 py-1.5 text-[12px] font-semibold leading-none text-black">
                  <Leaf className="h-3.5 w-3.5 text-[#ff7a3d]" />
                  Bilan officiel — {jouna.short} {jouna.edition}
                </span>
              </StaggerItem>
              <StaggerItem>
                <h1 className="mt-6 max-w-[980px] font-display text-[36px] font-medium leading-[0.95] sm:text-[52px] lg:text-[68px]">
                  {jouna.name}
                  <span className="block text-[#ff7a3d]">{jouna.edition}</span>
                </h1>
              </StaggerItem>
              <StaggerItem>
                <p className="mt-6 max-w-[720px] font-display text-[20px] font-medium leading-[1.25] text-white/90 sm:text-[26px]">« {jouna.theme} »</p>
              </StaggerItem>
              <StaggerItem>
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[13px] font-semibold text-white/80">
                  <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#ff7a3d]" /> {jouna.date}</span>
                  <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[#ff7a3d]" /> {jouna.venue}</span>
                </div>
              </StaggerItem>
            </StaggerContainer>

            <StaggerContainer delay={0.2} className="mt-14 grid grid-cols-2 gap-px overflow-hidden bg-white/15 sm:grid-cols-4 lg:grid-cols-7">
              {jounaResults.map((r, i) => (
                <StaggerItem key={r.label} className={`relative flex min-h-[130px] flex-col justify-between overflow-hidden px-5 py-6 ${i === 0 ? 'bg-[#ff7a3d]' : 'bg-black/60 backdrop-blur-md'}`}>
                  <p className="text-[30px] font-black leading-none">{r.value}</p>
                  <p className="mt-5 text-[12px] font-medium leading-tight text-white/85">{r.label}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Intro + institutions */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <div className="grid gap-12 border-t border-black pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
              <AnimatedSection direction="left">
                <h2 className="font-display text-[28px] font-medium leading-[0.95] text-black sm:text-[38px] lg:text-[46px]">
                  Un espace unique
                  <span className="block">pour préparer 2027</span>
                </h2>
                <p className="mt-8 max-w-[600px] text-[17px] font-medium leading-[1.6] text-black">{jouna.intro}</p>
                <p className="mt-5 max-w-[600px] text-[15px] font-medium leading-[1.7] text-black/70">
                  Les participants ont eu accès, dans un même lieu, à l’expertise technique, aux fournisseurs, aux institutions agricoles et aux acteurs du financement. CIPRESA y a joué un rôle de mobilisation et d’intermédiation, au service d’une agriculture fondée sur des plants de qualité, le conseil agro-pastoral, l’irrigation, la mécanisation et des projets bancables.
                </p>
              </AnimatedSection>
              <AnimatedSection direction="right">
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-black/50">Institutions et partenaires financiers</h3>
                <ul className="mt-5 divide-y divide-gray-200 bg-[#f6f5f2] ring-1 ring-gray-200">
                  {jounaInstitutions.map((inst) => (
                    <li key={inst.name} className="grid gap-1 px-6 py-4 sm:grid-cols-[170px_1fr] sm:gap-6">
                      <div>
                        <p className="text-[15px] font-semibold text-black">{inst.name}</p>
                        <p className="text-[11px] font-semibold text-[#ff7a3d]">{inst.role}</p>
                      </div>
                      <p className="text-[13px] font-medium leading-snug text-black/70">{inst.text}</p>
                    </li>
                  ))}
                </ul>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Panels */}
        <section className="bg-[#f6f5f2]">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <SectionHeading title="Quatre panels" line2="d’expertise" intro="Information technique et échanges directs avec les participants, de la production végétale au financement." />
            <StaggerContainer delay={0.1} className="mt-14 grid gap-px overflow-hidden bg-gray-200 ring-1 ring-gray-200 sm:grid-cols-2 lg:grid-cols-4">
              {jounaPanels.map((p, i) => (
                <StaggerItem key={p.title} className={`relative flex min-h-[320px] flex-col overflow-hidden px-7 py-8 ${i === 0 ? 'bg-[#ff7a3d] text-white' : 'bg-white text-black'}`}>
                  {i === 0 && <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-12 h-[210px] w-[210px] rounded-full border border-white/35 opacity-70" style={dotPattern} />}
                  <div className="relative flex items-start justify-between gap-4">
                    <p className="text-[34px] font-black leading-none">{String(i + 1).padStart(2, '0')}</p>
                    <Mic className={`h-5 w-5 ${i === 0 ? 'text-white' : 'text-[#ff7a3d]'}`} />
                  </div>
                  <h3 className="relative mt-8 text-[20px] font-semibold leading-tight">{p.title}</h3>
                  <p className={`relative mt-2 text-[13px] font-medium leading-[1.5] ${i === 0 ? 'text-white/90' : 'text-black/70'}`}>{p.topics}</p>
                  <div className={`relative my-5 h-px ${i === 0 ? 'bg-white/35' : 'bg-gray-200'}`} />
                  <ul className="relative space-y-1.5 text-[12px] font-medium">
                    {p.chair && <li className="font-semibold">Présidence : {p.chair}</li>}
                    {p.speakers.map((s) => <li key={s} className={i === 0 ? 'text-white/90' : 'text-black/70'}>{s}</li>)}
                  </ul>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Gallery */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <SectionHeading title="Temps forts" line2="de la journée" intro="Quelques images de la JOUNA 2026 au Palais des Congrès de Yaoundé." />
            <StaggerContainer delay={0.1} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
              {jounaGallery.map((g, i) => (
                <StaggerItem key={g.src} className={i < 3 ? 'lg:col-span-2' : 'lg:col-span-3'}>
                  <figure className="group">
                    <div className="relative aspect-[3/2] overflow-hidden bg-[#f6f5f2]">
                      <Image src={g.src} alt={g.caption} fill sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" />
                    </div>
                    <figcaption className="mt-3 text-[13px] font-medium text-black/70">{g.caption}</figcaption>
                  </figure>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Exhibitors + co-promoters */}
        <section className="bg-[#f6f5f2]">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <SectionHeading title="Exposants" line2="et co-promoteurs" intro="Onze stands et dix co-promoteurs aux côtés de CIPRESA, avec World AgroBusiness Global SARL comme sponsor officiel." />
            <StaggerContainer delay={0.1} className="mt-14 grid grid-cols-1 gap-px overflow-hidden bg-gray-200 ring-1 ring-gray-200 sm:grid-cols-2 lg:grid-cols-4">
              {jounaExhibitors.map((e, i) => (
                <StaggerItem key={e.name} className={`px-6 py-5 ${i === 0 ? 'bg-black text-white' : 'bg-white text-black'}`}>
                  <p className="text-[15px] font-semibold leading-tight">{e.name}</p>
                  <p className={`mt-1.5 text-[12px] font-medium ${i === 0 ? 'text-[#ff7a3d]' : 'text-black/60'}`}>{e.domain}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
            <AnimatedSection className="mt-10">
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-black/50">Co-promoteurs</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {jounaCoPromoters.map((c) => (
                  <li key={c} className="bg-white px-3 py-2 text-[12px] font-semibold text-black ring-1 ring-gray-200">{c}</li>
                ))}
              </ul>
            </AnimatedSection>
          </div>
        </section>

        {/* CIPRESA IA + committee + media */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <div className="grid gap-5 lg:grid-cols-3">
              <AnimatedSection className="relative overflow-hidden bg-[#ff7a3d] px-7 py-8 text-white">
                <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-12 h-[210px] w-[210px] rounded-full border border-white/35 opacity-70" style={dotPattern} />
                <Sparkles className="relative h-6 w-6" />
                <h3 className="relative mt-6 text-[20px] font-semibold leading-tight">Présentation de CIPRESA IA</h3>
                <p className="relative mt-3 text-[13px] font-medium leading-[1.6] text-white/90">
                  Une solution digitale pour harmoniser les techniques et les bonnes pratiques agricoles : informations techniques cohérentes, itinéraires culturaux de référence et meilleur accès au conseil, en complément des formations et du terrain.
                </p>
                <p className="relative mt-4 text-[11px] font-medium text-white/75">Présentation d’une orientation : il ne s’agit pas encore d’un déploiement généralisé.</p>
              </AnimatedSection>
              <AnimatedSection className="bg-[#f6f5f2] px-7 py-8 ring-1 ring-gray-200">
                <h3 className="text-[20px] font-semibold leading-tight text-black">Comité d’organisation</h3>
                <p className="mt-1 text-[12px] font-medium text-black/60">14 personnes, dont huit membres d’appui</p>
                <ul className="mt-5 divide-y divide-gray-200">
                  {jounaCommittee.map((m) => (
                    <li key={m.name} className="py-2.5">
                      <p className="text-[14px] font-semibold text-black">{m.name}</p>
                      <p className="text-[12px] font-medium text-[#ff7a3d]">{m.role}</p>
                    </li>
                  ))}
                </ul>
              </AnimatedSection>
              <AnimatedSection className="bg-black px-7 py-8 text-white">
                <Radio className="h-6 w-6 text-[#ff7a3d]" />
                <h3 className="mt-6 text-[20px] font-semibold leading-tight">Couverture médiatique</h3>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {jounaMedia.map((m) => (
                    <li key={m} className="bg-white/10 px-3 py-2 text-[12px] font-semibold">{m}</li>
                  ))}
                  <li className="px-1 py-2 text-[12px] font-medium text-white/60">et d’autres médias</li>
                </ul>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* 2027 goals + call for support */}
        <section className="bg-black text-white">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <StaggerContainer className="grid gap-8 border-t border-white/30 pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <StaggerItem>
                <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#ff7a3d]">Perspectives</p>
                <h2 className="font-display text-[28px] font-medium leading-[0.95] sm:text-[38px] lg:text-[46px]">
                  Objectifs
                  <span className="block">JOUNA 2027</span>
                </h2>
              </StaggerItem>
              <StaggerItem className="max-w-[460px]">
                <p className="text-[15px] font-medium leading-[1.55] text-white/80">
                  Renforcer la production locale et contribuer à la souveraineté alimentaire, dans l’orientation d’import-substitution du Cameroun.
                </p>
              </StaggerItem>
            </StaggerContainer>
            <StaggerContainer delay={0.1} className="mt-14 grid gap-px overflow-hidden bg-white/15 md:grid-cols-3">
              {jouna2027Goals.map((g, i) => (
                <StaggerItem key={g.label} className={`px-7 py-8 ${i === 2 ? 'bg-[#ff7a3d]' : 'bg-black'}`}>
                  <p className="text-[48px] font-black leading-none">{g.value}</p>
                  <h3 className="mt-4 text-[18px] font-semibold">{g.label}</h3>
                  <p className="mt-2 text-[13px] font-medium leading-[1.55] text-white/80">{g.text}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <AnimatedSection className="mt-14 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <p className="max-w-[760px] text-[15px] font-medium leading-[1.65] text-white/85">
                CIPRESA sollicite un soutien institutionnel, technique et financier pour élargir la mobilisation, accompagner la structuration des projets et renforcer leur suivi, au bénéfice direct des producteurs.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={`mailto:${company.email}?subject=${encodeURIComponent('Soutenir la JOUNA 2027')}`}
                  className="group inline-flex h-[46px] items-center justify-center gap-2 bg-[#ff7a3d] px-7 text-[13px] font-semibold text-white transition-colors hover:bg-[#e8662b]"
                >
                  Soutenir la JOUNA 2027
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                </a>
                <Link href="/partenaires" className="inline-flex h-[46px] items-center justify-center px-7 text-[13px] font-semibold text-white ring-1 ring-white/30 transition-colors hover:bg-white hover:text-black">
                  Plan 2027–2031
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
