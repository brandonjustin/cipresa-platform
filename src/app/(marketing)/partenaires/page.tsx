import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Leaf, ArrowUpRight, Check, Mail, Phone } from 'lucide-react';
import { PageTransition, AnimatedSection, StaggerContainer, StaggerItem } from '@/components/animations/motion-components';
import {
  company,
  companyKpis,
  strategy,
  agenda2027,
  roadmap,
  assetPortfolio,
  investmentLogic,
  financingAxes,
  whyCipresa,
  partnershipModes,
  partnershipSteps,
  sdgs,
} from '@/lib/utils/company';

export const metadata: Metadata = {
  title: 'Partenaires & investisseurs — Plan 2027–2031',
  description:
    'Plan stratégique CIPRESA 2027–2031 : agenda de structuration, actifs productifs, axes de financement et modalités de partenariat pour les partenaires financiers, techniques et institutionnels.',
};

const dotPattern = {
  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)',
  backgroundSize: '12px 12px',
};

function SectionHeading({ kicker, title, line2, intro }: { kicker?: string; title: string; line2: string; intro: string }) {
  return (
    <StaggerContainer className="grid gap-8 border-t border-black pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
      <StaggerItem>
        {kicker && <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#ff7a3d]">{kicker}</p>}
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

export default function PartnersPage() {
  return (
    <PageTransition>
      <div className="pt-[60px]">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#f6f5f2]">
          <div className="relative mx-auto max-w-[1520px] px-6 pb-16 pt-10 sm:px-10 lg:px-14 lg:pb-20 lg:pt-14">
            <StaggerContainer className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <div>
                <StaggerItem>
                  <span className="inline-flex items-center gap-2 bg-white px-3 py-1.5 text-[12px] font-semibold leading-none text-black ring-1 ring-black/10">
                    <Leaf className="h-3.5 w-3.5 text-[#ff7a3d]" />
                    Partenaires & investisseurs
                  </span>
                </StaggerItem>
                <StaggerItem>
                  <h1 className="mt-6 font-display text-[36px] font-medium leading-[0.95] text-black sm:text-[50px] lg:text-[64px]">
                    CIPRESA
                    <span className="block">2027–2031</span>
                  </h1>
                </StaggerItem>
              </div>
              <StaggerItem className="max-w-[460px]">
                <p className="text-[15px] font-medium leading-[1.55] text-black">{company.positioning}</p>
                <div className="mt-7 flex flex-wrap items-center gap-5">
                  <a
                    href={`mailto:${company.email}?subject=${encodeURIComponent('Partenariat CIPRESA 2027–2031')}`}
                    className="group inline-flex h-[42px] min-w-[154px] items-center justify-center gap-2 bg-black px-7 text-[13px] font-semibold text-white transition-colors hover:bg-cipresa-950"
                  >
                    Demander le dossier complet
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                  </a>
                  <a href="#feuille-de-route" className="text-[13px] font-semibold text-black underline-offset-4 transition-colors hover:text-[#ff7a3d] hover:underline">
                    Feuille de route
                  </a>
                </div>
              </StaggerItem>
            </StaggerContainer>

            <StaggerContainer delay={0.2} className="mt-14 grid grid-cols-2 gap-px overflow-hidden bg-gray-200 shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200 sm:grid-cols-3 lg:grid-cols-9">
              {companyKpis.map((k, i) => (
                <StaggerItem key={k.label} className={`relative flex min-h-[130px] flex-col justify-between overflow-hidden px-5 py-6 ${i === 0 ? 'bg-[#ff7a3d] text-white' : 'bg-white text-black'}`}>
                  <p className="text-[26px] font-black leading-none sm:text-[28px]">{k.display}</p>
                  <p className={`mt-5 text-[12px] font-medium leading-tight ${i === 0 ? 'text-white/90' : 'text-black/70'}`}>{k.label}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Strategy */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <SectionHeading
              title="Un groupe agricole"
              line2="régional intégré"
              intro={`Créée en ${company.founded} et constituée en SARL en ${company.sarlSince}, CIPRESA intervient dans ${company.countries} pays d’${company.zones}.`}
            />
            <StaggerContainer delay={0.1} className="mt-14 grid gap-px overflow-hidden bg-gray-200 ring-1 ring-gray-200 sm:grid-cols-2 lg:grid-cols-4">
              {strategy.map((s, i) => (
                <StaggerItem key={s.title} className={`relative flex min-h-[260px] flex-col overflow-hidden px-7 py-8 ${i === 0 ? 'bg-[#ff7a3d] text-white' : 'bg-white text-black'}`}>
                  {i === 0 && <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-12 h-[210px] w-[210px] rounded-full border border-white/35 opacity-70" style={dotPattern} />}
                  <p className="relative text-[34px] font-black leading-none">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="relative mt-auto pt-10 text-[20px] font-semibold leading-tight">{s.title}</h3>
                  <p className={`relative mt-3 text-[13px] font-medium leading-[1.55] ${i === 0 ? 'text-white/90' : 'text-black/70'}`}>{s.text}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Agenda 2027 */}
        <section className="bg-[#f6f5f2]">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <SectionHeading
              kicker="Agenda stratégique"
              title="2027, l’année"
              line2="charnière"
              intro="Structurer, digitaliser, commercialiser et consolider les plateformes de croissance, pour des activités plus visibles, réplicables et prêtes pour l’investissement."
            />
            <div className="mt-14 divide-y divide-gray-200 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200">
              {agenda2027.map((a, i) => (
                <AnimatedSection key={a.pillar} className="grid gap-3 px-6 py-6 md:grid-cols-[60px_240px_1fr] md:items-baseline md:gap-8 lg:px-8">
                  <span className="text-[13px] font-black text-[#ff7a3d]">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="text-[17px] font-semibold leading-tight text-black">{a.pillar}</h3>
                  <p className="text-[14px] font-medium leading-[1.55] text-black/70">{a.deliverables}</p>
                </AnimatedSection>
              ))}
            </div>
            <AnimatedSection className="mt-6 bg-black px-6 py-5 text-[14px] font-medium leading-[1.55] text-white lg:px-8">
              <span className="font-semibold text-[#ff7a3d]">Résultat attendu fin 2027 : </span>
              une CIPRESA mieux structurée, plus digitalisée, commercialement plus robuste et dotée de plateformes capables de soutenir l’accélération des investissements dans les actifs productifs.
            </AnimatedSection>
          </div>
        </section>

        {/* Roadmap 2028–2031 */}
        <section id="feuille-de-route" className="scroll-mt-20 bg-white">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <SectionHeading
              kicker="Feuille de route"
              title="2028–2031 : des services"
              line2="aux actifs productifs"
              intro="Construire la base d’actifs, passer à l’échelle, consolider les métiers cœur, puis industrialiser."
            />
            <StaggerContainer delay={0.1} className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {roadmap.map((y, i) => (
                <StaggerItem key={y.year} className="flex h-full flex-col bg-[#f6f5f2] ring-1 ring-gray-200">
                  <div className={`relative overflow-hidden px-6 py-6 ${i === roadmap.length - 1 ? 'bg-[#ff7a3d] text-white' : 'bg-black text-white'}`}>
                    <p className="text-[40px] font-black leading-none">{y.year}</p>
                    <p className="mt-2 text-[13px] font-medium leading-snug text-white/85">{y.theme}</p>
                  </div>
                  <ul className="flex-1 divide-y divide-gray-200">
                    {y.items.map((it) => (
                      <li key={it.title} className="px-6 py-5">
                        <h3 className="text-[15px] font-semibold leading-tight text-black">{it.title}</h3>
                        <p className="mt-1.5 text-[12px] font-medium leading-[1.5] text-black/70">{it.text}</p>
                      </li>
                    ))}
                  </ul>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Assets + investment logic */}
        <section className="bg-[#f6f5f2]">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <SectionHeading
              title="Portefeuille d’actifs"
              line2="cible à horizon 2029"
              intro="Des actifs tangibles qui sécurisent la production et soutiennent le financement bancaire, le crédit-bail et les co-investissements."
            />
            <div className="mt-14 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
              <AnimatedSection className="overflow-x-auto bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200">
                <table className="w-full min-w-[520px] text-left">
                  <thead>
                    <tr className="border-b border-gray-200 text-[12px] font-semibold text-black/50">
                      <th className="px-6 py-4 font-semibold">Actif</th>
                      <th className="px-6 py-4 font-semibold">Dimension cible</th>
                      <th className="px-6 py-4 font-semibold">Finalité</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {assetPortfolio.map((a) => (
                      <tr key={a.asset}>
                        <td className="px-6 py-5 text-[14px] font-semibold text-black">{a.asset}</td>
                        <td className="px-6 py-5 text-[18px] font-black text-[#ff7a3d]">{a.size}</td>
                        <td className="px-6 py-5 text-[13px] font-medium leading-snug text-black/70">{a.purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </AnimatedSection>
              <AnimatedSection className="relative overflow-hidden bg-[#ff7a3d] px-7 py-8 text-white">
                <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-12 h-[230px] w-[230px] rounded-full border border-white/35 opacity-70" style={dotPattern} />
                <h3 className="relative text-[18px] font-semibold leading-tight">Logique d’investissement 2028–2029</h3>
                <ul className="relative mt-6 space-y-4">
                  {investmentLogic.map((l) => (
                    <li key={l} className="flex items-start gap-3 text-[13px] font-medium leading-snug">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" />
                      {l}
                    </li>
                  ))}
                </ul>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Financing axes */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <SectionHeading
              kicker="Financement"
              title="Axes prioritaires"
              line2="2027–2031"
              intro="Six familles de besoins, de l’équipement à l’agro-industrie, ouvertes au financement et au co-investissement."
            />
            <StaggerContainer delay={0.1} className="mt-14 grid gap-px overflow-hidden bg-gray-200 ring-1 ring-gray-200 sm:grid-cols-2 lg:grid-cols-3">
              {financingAxes.map((f, i) => (
                <StaggerItem key={f.title} className="group relative flex min-h-[190px] flex-col bg-white px-7 py-7">
                  <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#ff7a3d] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                  <p className="text-[13px] font-black text-[#ff7a3d]">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="mt-6 text-[18px] font-semibold leading-tight text-black">{f.title}</h3>
                  <p className="mt-3 text-[13px] font-medium leading-[1.55] text-black/70">{f.text}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Why + modalities + path */}
        <section className="bg-black text-white">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <StaggerContainer className="grid gap-8 border-t border-white/30 pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <StaggerItem>
                <h2 className="font-display text-[28px] font-medium leading-[0.95] sm:text-[38px] lg:text-[46px]">
                  Pourquoi
                  <span className="block">CIPRESA</span>
                </h2>
              </StaggerItem>
              <StaggerItem className="max-w-[440px]">
                <p className="text-[15px] font-medium leading-[1.55] text-white/80">Une plateforme d’exécution agricole pensée pour la croissance régionale.</p>
              </StaggerItem>
            </StaggerContainer>

            <StaggerContainer delay={0.1} className="mt-14 grid gap-px overflow-hidden bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
              {whyCipresa.map((w) => (
                <StaggerItem key={w.title} className="bg-black px-7 py-8">
                  <h3 className="text-[18px] font-semibold leading-tight">{w.title}</h3>
                  <p className="mt-3 text-[13px] font-medium leading-[1.55] text-white/70">{w.text}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-16">
              <AnimatedSection direction="left">
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#ff7a3d]">Modalités de partenariat</h3>
                <ul className="mt-6 space-y-4">
                  {partnershipModes.map((m) => (
                    <li key={m} className="flex items-start gap-3 text-[14px] font-medium leading-snug text-white/90">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ff7a3d]" />
                      {m}
                    </li>
                  ))}
                </ul>
              </AnimatedSection>
              <AnimatedSection direction="right">
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#ff7a3d]">Parcours de partenariat</h3>
                <ol className="mt-6 grid gap-px overflow-hidden bg-white/15 sm:grid-cols-2">
                  {partnershipSteps.map((s, i) => (
                    <li key={s.title} className="bg-black px-6 py-6">
                      <p className="text-[28px] font-black leading-none text-[#ff7a3d]">{String(i + 1).padStart(2, '0')}</p>
                      <p className="mt-4 text-[16px] font-semibold">{s.title}</p>
                      <p className="mt-1 text-[12px] font-medium text-white/60">{s.text}</p>
                    </li>
                  ))}
                </ol>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* SDGs */}
        <section className="bg-[#f6f5f2]">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <SectionHeading
              kicker="Impact"
              title="Contribution aux"
              line2="Objectifs de Développement Durable"
              intro="Productivité agricole, professionnalisation de la jeunesse, modernisation rurale, chaînes de valeur locales et reforestation."
            />
            <StaggerContainer delay={0.1} className="mt-14 grid grid-cols-2 gap-px overflow-hidden bg-gray-200 ring-1 ring-gray-200 md:grid-cols-3 lg:grid-cols-6">
              {sdgs.map((s) => (
                <StaggerItem key={s.n} className="flex min-h-[190px] flex-col bg-white px-6 py-6">
                  <p className="text-[12px] font-semibold text-black/50">ODD</p>
                  <p className="text-[40px] font-black leading-none text-[#ff7a3d]">{s.n}</p>
                  <h3 className="mt-auto pt-6 text-[14px] font-semibold leading-tight text-black">{s.title}</h3>
                  <p className="mt-1.5 text-[12px] font-medium leading-snug text-black/70">{s.text}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Proof of execution: JOUNA */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1520px] px-6 pt-16 sm:px-10 lg:px-14 lg:pt-20">
            <AnimatedSection className="grid gap-8 border-t border-black pt-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#ff7a3d]">Preuve d’exécution</p>
                <h2 className="mt-4 font-display text-[26px] font-medium leading-[1] text-black sm:text-[34px]">JOUNA 2026 : 500 agriculteurs mobilisés</h2>
                <p className="mt-4 max-w-[560px] text-[14px] font-medium leading-[1.6] text-black/70">
                  4 panels, 21 intervenants, 11 stands, au moins 50 échanges B2B et 20 projets présélectionnés, avec BC-PME, MUPECI, MAZIPI et la CAPEF. Objectifs 2027 : 1 500 agriculteurs, 500 projets structurés, 100 projets financés.
                </p>
                <Link href="/jouna" className="group mt-6 inline-flex h-[42px] items-center gap-2 bg-black px-7 text-[13px] font-semibold text-white transition-colors hover:bg-cipresa-950">
                  Lire le bilan
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                </Link>
              </div>
              <div className="relative aspect-[654/337] overflow-hidden bg-[#f6f5f2]">
                <Image src="/images/jouna/photo-de-famille.jpg" alt="Photo de famille de la JOUNA 2026 au Palais des Congrès de Yaoundé" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1520px] px-6 py-16 sm:px-10 lg:px-14 lg:py-20">
            <div className="relative grid gap-8 overflow-hidden bg-[#ff7a3d] px-7 py-10 text-white lg:grid-cols-[1fr_auto] lg:items-center lg:px-12 lg:py-14">
              <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 right-[30%] h-[300px] w-[300px] rounded-full border border-white/35 opacity-70" style={dotPattern} />
              <div className="relative">
                <p className="font-display text-[26px] font-medium leading-[1.1] sm:text-[36px]">Construisons ensemble le groupe agricole régional de 2031.</p>
                <p className="mt-3 max-w-[640px] text-[14px] font-medium text-white/90">
                  Financeurs, institutions, partenaires techniques et commerciaux : parlons de votre projet de partenariat.
                </p>
              </div>
              <div className="relative flex flex-col gap-3 sm:flex-row lg:flex-col">
                <a href={`mailto:${company.email}`} className="inline-flex h-[46px] items-center gap-2 bg-black px-6 text-[13px] font-semibold text-white transition-colors hover:bg-cipresa-950">
                  <Mail className="h-4 w-4" /> {company.email}
                </a>
                <a href={company.phoneHref} className="inline-flex h-[46px] items-center gap-2 bg-white px-6 text-[13px] font-semibold text-black transition-colors hover:bg-black hover:text-white">
                  <Phone className="h-4 w-4" /> {company.phone}
                </a>
              </div>
            </div>
            <p className="mt-6 text-[12px] font-medium text-black/50">
              Source : Présentation officielle CIPRESA 2027–2031, rédigée par Kana Evariste (15 octobre 2026), tirée du livre-projet « Vision CIPRESA 2060 ».{' '}
              <Link href="/fondateur" className="underline underline-offset-2 hover:text-[#ff7a3d]">Découvrir le fondateur</Link>
            </p>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
