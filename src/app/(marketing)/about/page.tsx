import Image from 'next/image';
import Link from 'next/link';
import { Leaf, Target, Eye, Heart, ArrowUpRight, MapPin, Sprout, Users, Globe2, Lightbulb, Quote } from 'lucide-react';
import { PageTransition, AnimatedSection, StaggerContainer, StaggerItem } from '@/components/animations/motion-components';
import { teamMembers } from '@/lib/utils/data';
import { founder } from '@/lib/utils/founder';
import { company, strategy, companyValues, platforms, entities, leadership, directions, workforce } from '@/lib/utils/company';

const storyStats = [
  { value: '145', label: 'Projets réalisés', icon: Lightbulb },
  { value: '4,2 M', label: 'Plants vendus', icon: Sprout },
  { value: '11 000', label: 'Agriculteurs formés', icon: Users },
  { value: '9', label: 'Pays couverts en Afrique', icon: Globe2 },
];

const companyFacts: [string, string][] = [
  ['Dénomination', company.name],
  ['Statut', company.status],
  ['Création', `${company.founded} — SARL depuis ${company.sarlSince}`],
  ['Siège social', company.legalSeat],
  ['Base opérationnelle', company.address],
  ['RCCM', company.rccm],
  ['NUI', company.nui],
  ['Zones d’intervention', `${company.zones} — ${company.countries} pays`],
  ['Capital humain', 'Environ 120 collaborateurs'],
  ['Ressources végétales', `${company.species} espèces disponibles en pépinière`],
  ['Capital social', company.capital],
];

const missionItems: { icon: typeof Target; title: string; desc: string; values?: string[] }[] = [
  {
    icon: Target,
    title: 'Notre mission',
    desc: strategy[0].text,
  },
  {
    icon: Eye,
    title: 'Notre vision 2031',
    desc: strategy[1].text,
  },
  {
    icon: Heart,
    title: 'Nos valeurs',
    desc: 'Six valeurs guident chacune de nos missions, du diagnostic jusqu\'au suivi des performances.',
    values: companyValues,
  },
];

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="pt-[60px]">
        <section className="relative overflow-hidden bg-[#f6f5f2]">
          <div className="relative mx-auto max-w-[1520px] px-6 pb-16 pt-10 sm:px-10 lg:px-14 lg:pb-20 lg:pt-14">
            <StaggerContainer className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <div>
                <StaggerItem>
                  <span className="inline-flex items-center gap-2 bg-white px-3 py-1.5 text-[12px] font-semibold leading-none text-black ring-1 ring-black/10">
                    <Leaf className="h-3.5 w-3.5 text-[#ff7a3d]" />
                    À propos
                  </span>
                </StaggerItem>
                <StaggerItem>
                  <h1 className="mt-6 font-display text-[36px] font-medium leading-[0.95] text-black sm:text-[50px] lg:text-[64px]">
                    Leader agricole
                    <span className="block">camerounais</span>
                  </h1>
                </StaggerItem>
              </div>

              <StaggerItem className="max-w-[420px]">
                <p className="text-[15px] font-medium leading-[1.55] text-black">
                  Depuis notre création, nous accompagnons les agriculteurs africains vers une agriculture moderne, durable et rentable.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-5">
                  <Link
                    href="/services"
                    className="group inline-flex h-[42px] min-w-[154px] items-center justify-center gap-2 bg-black px-7 text-[13px] font-semibold text-white transition-colors hover:bg-cipresa-950"
                  >
                    Nos services
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                  </Link>
                  <a
                    href="#notre-histoire"
                    className="text-[13px] font-semibold text-black underline-offset-4 transition-colors hover:text-[#ff7a3d] hover:underline"
                  >
                    Notre histoire
                  </a>
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
                <MapPin className="relative h-5 w-5" />
                <p className="relative mt-5 text-[26px] font-black leading-none">{company.countries} pays</p>
                <p className="relative mt-1.5 max-w-[260px] text-[14px] font-medium leading-tight">
                  En {company.zones}, depuis Yaoundé, Carrefour Nomayos
                </p>
                <Leaf className="absolute right-[30%] top-10 h-5 w-5 fill-white text-white" />
              </StaggerItem>

              <StaggerItem className="border-t border-gray-200 px-7 py-7 md:border-l md:border-t-0 lg:px-8">
                <p className="text-[34px] font-black leading-none text-black">120+</p>
                <div className="my-5 h-px bg-gray-200" />
                <p className="max-w-[240px] text-[12px] font-medium leading-tight text-black">
                  Collaborateurs, dont 11+ ingénieurs et 19 techniciens spécialisés
                </p>
              </StaggerItem>

              <StaggerItem className="border-t border-gray-200 md:border-l md:border-t-0">
                <Link href="/contact" className="group flex h-full flex-col justify-between gap-6 px-7 py-7 transition-colors duration-500 hover:bg-black lg:px-8">
                  <p className="text-[18px] font-semibold leading-tight text-black transition-colors duration-500 group-hover:text-white">
                    Travaillons ensemble
                  </p>
                  <div className="flex items-end justify-between gap-5">
                    <p className="max-w-[210px] text-[12px] font-medium leading-tight text-black transition-colors duration-500 group-hover:text-white/80">
                      Parlez-nous de votre projet agricole
                    </p>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff7a3d] text-white transition-transform duration-500 group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        <section id="notre-histoire" className="scroll-mt-20 bg-white">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <div className="grid gap-12 border-t border-black pt-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
              <AnimatedSection direction="left">
                <h2 className="font-display text-[28px] font-medium leading-[0.95] text-black sm:text-[38px] lg:text-[46px]">
                  Notre
                  <span className="block">histoire</span>
                </h2>
                <div className="mt-8 max-w-[600px] space-y-5">
                  <p className="text-[18px] font-medium leading-[1.6] text-black">
                    CIPRESA Consulting SARL, Cabinet International de Prestation de Services Agricoles, est né d&apos;une conviction : l&apos;agriculture africaine ne manque ni de terre, ni de talents, ni de marchés ; elle a besoin de méthode, de technique et de gestion.
                  </p>
                  <p className="text-[15px] font-medium leading-[1.7] text-black/70">
                    Créé en {company.founded} par Kana Evariste, ingénieur agronome passé d&apos;un quart d&apos;hectare à Bafou à trois hectares à Mbalmayo, le cabinet est devenu SARL en {company.sarlSince}. Il a depuis réalisé 145 projets et plus de 870 hectares, et réunit environ 120 collaborateurs dans {company.countries} pays d&apos;{company.zones}.
                  </p>
                  <p className="text-[15px] font-medium leading-[1.7] text-black/70">
                    {company.positioning}
                  </p>
                </div>
              </AnimatedSection>

              <StaggerContainer className="grid grid-cols-2 gap-px self-start overflow-hidden bg-gray-200 shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200">
                {storyStats.map((s, i) => {
                  const featured = i === 0;
                  return (
                    <StaggerItem
                      key={s.label}
                      className={`group relative flex min-h-[190px] flex-col justify-between overflow-hidden px-6 py-7 lg:min-h-[220px] lg:px-8 ${
                        featured ? 'bg-[#ff7a3d] text-white' : 'bg-white text-black'
                      }`}
                    >
                      {featured ? (
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -bottom-24 -right-12 h-[210px] w-[210px] rounded-full border border-white/35 opacity-70"
                          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
                        />
                      ) : (
                        <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#ff7a3d] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                      )}
                      <span
                        className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-500 group-hover:rotate-[-8deg] ${
                          featured ? 'border border-white/50' : 'bg-[#ff7a3d]/10 text-[#ff7a3d]'
                        }`}
                      >
                        <s.icon className="h-4 w-4 stroke-[1.8]" />
                      </span>
                      <div className="relative pt-8">
                        <p className="text-[36px] font-black leading-none sm:text-[42px]">{s.value}</p>
                        <p className={`mt-2 text-[13px] font-medium leading-tight ${featured ? 'text-white/90' : 'text-black/70'}`}>{s.label}</p>
                      </div>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            </div>
          </div>
        </section>

        <section className="bg-[#f6f5f2]">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <StaggerContainer className="grid gap-8 border-t border-black pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <StaggerItem>
                <h2 className="font-display text-[28px] font-medium leading-[0.95] text-black sm:text-[38px] lg:text-[46px]">
                  Mission, vision
                  <span className="block">et valeurs</span>
                </h2>
              </StaggerItem>
              <StaggerItem className="max-w-[420px]">
                <p className="text-[15px] font-medium leading-[1.55] text-black">
                  Ce qui nous guide au quotidien aupres des agriculteurs africains.
                </p>
              </StaggerItem>
            </StaggerContainer>

            <StaggerContainer delay={0.1} className="mt-14 grid gap-px overflow-hidden bg-gray-200 shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200 md:grid-cols-3">
              {missionItems.map((item, i) => {
                const featured = i === 0;
                return (
                  <StaggerItem
                    key={item.title}
                    className={`group relative flex min-h-[340px] flex-col overflow-hidden px-7 py-8 lg:px-8 ${
                      featured ? 'bg-[#ff7a3d] text-white' : 'bg-white text-black'
                    }`}
                  >
                    {featured ? (
                      <>
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -bottom-24 -right-12 h-[230px] w-[230px] rounded-full border border-white/35 opacity-70 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-3"
                          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
                        />
                        <Leaf aria-hidden="true" className="pointer-events-none absolute right-[28%] top-12 h-5 w-5 fill-white text-white" />
                      </>
                    ) : (
                      <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#ff7a3d] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                    )}

                    <div className="relative flex items-start justify-between gap-4">
                      <p className="text-[34px] font-black leading-none">{String(i + 1).padStart(2, '0')}</p>
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-500 group-hover:rotate-[-8deg] ${
                          featured
                            ? 'bg-white text-[#ff7a3d]'
                            : 'bg-[#ff7a3d]/10 text-[#ff7a3d] group-hover:bg-[#ff7a3d] group-hover:text-white'
                        }`}
                      >
                        <item.icon className="h-5 w-5 stroke-[1.8]" />
                      </span>
                    </div>

                    <div className="relative mt-auto pt-14">
                      <h3 className="text-[20px] font-semibold leading-tight">{item.title}</h3>
                      <div className={`my-5 h-px ${featured ? 'bg-white/35' : 'bg-gray-200'}`} />
                      <p className={`text-[13px] font-medium leading-[1.55] ${featured ? 'text-white/90' : 'text-black/70'}`}>{item.desc}</p>
                      {item.values && (
                        <ul className="mt-5 flex flex-wrap gap-2">
                          {item.values.map((v) => (
                            <li
                              key={v}
                              className={`px-2.5 py-1 text-[11px] font-semibold leading-none ${
                                featured ? 'bg-white/20 text-white' : 'bg-[#f6f5f2] text-black'
                              }`}
                            >
                              {v}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </section>

        <section className="bg-black text-white">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-16">
              <AnimatedSection direction="left">
                <div className="relative flex aspect-[4/5] max-w-[420px] items-start overflow-hidden bg-[#ff7a3d] p-8">
                  {founder.portrait ? (
                    <Image src={founder.portrait} alt={`Portrait de ${founder.name}`} fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover object-top" />
                  ) : (
                    <span aria-hidden="true" className="font-display text-[120px] font-medium leading-none text-white/90">{founder.initials}</span>
                  )}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-24 -right-12 h-[260px] w-[260px] rounded-full border border-white/35 opacity-70"
                    style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
                  />
                </div>
              </AnimatedSection>
              <AnimatedSection direction="right">
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#ff7a3d]">Le fondateur</p>
                <h2 className="mt-4 font-display text-[32px] font-medium leading-[0.95] sm:text-[44px] lg:text-[54px]">{founder.name}</h2>
                <p className="mt-3 text-[14px] font-semibold text-white/70">{founder.role} • PCA de SOCAPRA</p>
                <Quote className="mt-8 h-6 w-6 text-[#ff7a3d]" />
                <p className="mt-3 max-w-[640px] font-display text-[22px] font-medium leading-[1.2] sm:text-[28px]">« {founder.quote} »</p>
                <p className="mt-6 max-w-[620px] text-[15px] font-medium leading-[1.7] text-white/70">{founder.summary}</p>
                <Link
                  href="/fondateur"
                  className="group mt-8 inline-flex h-[42px] items-center justify-center gap-2 bg-[#ff7a3d] px-7 text-[13px] font-semibold text-white transition-colors hover:bg-[#e8662b]"
                >
                  Lire sa biographie
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                </Link>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <StaggerContainer className="grid gap-8 border-t border-black pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <StaggerItem>
                <h2 className="font-display text-[28px] font-medium leading-[0.95] text-black sm:text-[38px] lg:text-[46px]">
                  Gouvernance
                  <span className="block">& organisation</span>
                </h2>
              </StaggerItem>
              <StaggerItem className="max-w-[420px]">
                <p className="text-[15px] font-medium leading-[1.55] text-black">
                  Une direction stratégique, une direction générale et technique, et cinq directions opérationnelles.
                </p>
              </StaggerItem>
            </StaggerContainer>

            <StaggerContainer delay={0.1} className="mt-14 grid gap-5 md:grid-cols-2">
              {leadership.map((l, i) => {
                const body = (
                  <>
                    <p className={`text-[12px] font-semibold uppercase tracking-[0.14em] ${i === 0 ? 'text-white/85' : 'text-[#ff7a3d]'}`}>{l.role}</p>
                    <h3 className="mt-4 text-[24px] font-semibold leading-tight">{l.name}</h3>
                    <p className={`mt-3 max-w-[520px] text-[14px] font-medium leading-[1.6] ${i === 0 ? 'text-white/90' : 'text-black/70'}`}>{l.text}</p>
                    {l.href && (
                      <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold">
                        Sa biographie <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                      </span>
                    )}
                  </>
                );
                const cls = `group relative block h-full overflow-hidden px-7 py-8 lg:px-9 ${i === 0 ? 'bg-[#ff7a3d] text-white' : 'bg-[#f6f5f2] text-black ring-1 ring-gray-200'}`;
                return (
                  <StaggerItem key={l.name} className="h-full">
                    {l.href ? <Link href={l.href} className={cls}>{body}</Link> : <div className={cls}>{body}</div>}
                  </StaggerItem>
                );
              })}
            </StaggerContainer>

            <StaggerContainer delay={0.1} className="mt-5 grid gap-px overflow-hidden bg-gray-200 ring-1 ring-gray-200 sm:grid-cols-2 lg:grid-cols-5">
              {directions.map((d) => (
                <StaggerItem key={d.name} className="bg-white px-6 py-6">
                  <p className="text-[11px] font-semibold text-black/50">Direction</p>
                  <h3 className="mt-1 text-[16px] font-semibold leading-tight text-black">{d.name}</h3>
                  <p className="mt-2 text-[12px] font-medium leading-[1.5] text-black/70">{d.text}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-16">
              <AnimatedSection direction="left">
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-black/50">Capital humain</h3>
                <ul className="mt-5 grid grid-cols-2 gap-px overflow-hidden bg-gray-200 ring-1 ring-gray-200 sm:grid-cols-3">
                  {workforce.map((w) => (
                    <li key={w.label} className="bg-white px-5 py-5">
                      <p className="text-[28px] font-black leading-none text-black">{w.value}</p>
                      <p className="mt-2 text-[12px] font-medium text-black/70">{w.label}</p>
                    </li>
                  ))}
                </ul>
              </AnimatedSection>
              <AnimatedSection direction="right">
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-black/50">Fiche signalétique</h3>
                <dl className="mt-5 divide-y divide-gray-200 bg-white ring-1 ring-gray-200">
                  {companyFacts.map(([k, v]) => (
                    <div key={k} className="grid gap-1 px-6 py-3.5 sm:grid-cols-[160px_1fr] sm:gap-6">
                      <dt className="text-[12px] font-semibold text-[#ff7a3d]">{k}</dt>
                      <dd className="text-[13px] font-medium leading-snug text-black">{v}</dd>
                    </div>
                  ))}
                </dl>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <section id="plateformes" className="scroll-mt-20 bg-[#f6f5f2]">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <StaggerContainer className="grid gap-8 border-t border-black pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <StaggerItem>
                <h2 className="font-display text-[28px] font-medium leading-[0.95] text-black sm:text-[38px] lg:text-[46px]">
                  Les plateformes
                  <span className="block">et entités CIPRESA</span>
                </h2>
              </StaggerItem>
              <StaggerItem className="max-w-[420px]">
                <p className="text-[15px] font-medium leading-[1.55] text-black">
                  Pilotage, intelligence artificielle, finance, média, formation, investissement vert : sept plateformes stratégiques, adossées à quatre entités de terrain.
                </p>
              </StaggerItem>
            </StaggerContainer>

            <StaggerContainer delay={0.1} className="mt-14 grid gap-px overflow-hidden bg-gray-200 shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200 sm:grid-cols-2 lg:grid-cols-4">
              {platforms.map((item) => (
                <StaggerItem key={item.name} className="group relative flex min-h-[210px] flex-col bg-white px-6 py-7">
                  <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#ff7a3d] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                  <span className="self-start bg-[#f6f5f2] px-2.5 py-1 text-[11px] font-semibold leading-none text-black">{item.tag}</span>
                  <h3 className="mt-6 text-[18px] font-semibold leading-tight text-black">{item.name}</h3>
                  <p className="mt-3 text-[13px] font-medium leading-[1.55] text-black/70">{item.text}</p>
                </StaggerItem>
              ))}
              <StaggerItem className="relative flex min-h-[210px] flex-col justify-between overflow-hidden bg-[#ff7a3d] px-6 py-7 text-white">
                <MapPin className="h-5 w-5" />
                <div>
                  <p className="text-[18px] font-semibold leading-tight">Pépinières CIPRESA</p>
                  <p className="mt-2 text-[13px] font-medium leading-[1.5] text-white/90">
                    {company.species} espèces à Yaoundé, Bafoussam et Djombe (Littoral) : avocatiers, manguiers, safoutiers, agrumes, plantain, papayers.
                  </p>
                </div>
              </StaggerItem>
            </StaggerContainer>

            <StaggerContainer delay={0.1} className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {entities.map((item) => {
                const body = (
                  <>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ff7a3d]">{item.tag}</p>
                    <h3 className="mt-3 text-[17px] font-semibold leading-tight">{item.name}</h3>
                    <p className="mt-2 text-[12px] font-medium leading-[1.5] text-white/70">{item.text}</p>
                    {'href' in item && (
                      <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#ff7a3d]">
                        Voir le bilan <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </>
                );
                return (
                  <StaggerItem key={item.name} className="h-full">
                    {'href' in item ? (
                      <Link href={item.href} className="block h-full bg-black px-6 py-6 text-white transition-colors hover:bg-cipresa-950">{body}</Link>
                    ) : (
                      <div className="h-full bg-black px-6 py-6 text-white">{body}</div>
                    )}
                  </StaggerItem>
                );
              })}
            </StaggerContainer>

            <AnimatedSection className="mt-10">
              <Link
                href="/partenaires"
                className="group inline-flex h-[42px] items-center justify-center gap-2 bg-black px-7 text-[13px] font-semibold text-white transition-colors hover:bg-cipresa-950"
              >
                Plan stratégique 2027–2031
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </AnimatedSection>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <StaggerContainer className="grid gap-8 border-t border-black pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <StaggerItem>
                <h2 className="font-display text-[28px] font-medium leading-[0.95] text-black sm:text-[38px] lg:text-[46px]">
                  Notre
                  <span className="block">équipe</span>
                </h2>
              </StaggerItem>
              <StaggerItem className="max-w-[420px]">
                <p className="text-[15px] font-medium leading-[1.55] text-black">
                  Des experts passionnés au service de l&apos;agriculture africaine.
                </p>
              </StaggerItem>
            </StaggerContainer>

            <StaggerContainer delay={0.1} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member, i) => (
                <StaggerItem key={member.id} className="h-full">
                  <article className="group relative flex h-full flex-col bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200 transition-shadow duration-500 hover:shadow-[0_24px_60px_rgba(0,0,0,0.1)]">
                    <div className="relative h-[240px] overflow-hidden bg-[#f6f5f2] sm:h-[260px] lg:h-[280px]">
                      {member.avatar ? (
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover object-top grayscale-[35%] transition duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:grayscale-0"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center font-display text-[96px] font-medium text-[#ff7a3d]/40">
                          {member.name.charAt(0)}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <span className="absolute left-5 top-5 bg-white px-3 py-1.5 text-[12px] font-semibold leading-none text-black">
                        {member.role}
                      </span>
                      <p className="absolute bottom-5 left-5 text-[34px] font-black leading-none text-white">
                        {String(i + 1).padStart(2, '0')}
                      </p>
                      <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[#ff7a3d] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                    </div>

                    <div className="flex flex-1 flex-col px-6 py-5">
                      <h3 className="text-[18px] font-semibold leading-tight text-black">{member.name}</h3>
                      <p className="mt-1 text-[12px] font-semibold text-[#ff7a3d]">{member.role}</p>
                      <div className="my-4 h-px bg-gray-200" />
                      <p className="line-clamp-3 text-[13px] font-medium leading-[1.5] text-black/70">{member.bio}</p>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
