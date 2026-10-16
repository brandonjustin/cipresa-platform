'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  GraduationCap, Store, Tractor, Globe,
  Users, Sprout, Droplets, Hammer, Shield, TrendingUp,
  Leaf, ArrowUpRight, Package, Handshake, Truck, Cpu, Factory
} from 'lucide-react';
import { PageTransition } from '@/components/animations/motion-components';
import { stats } from '@/lib/utils/data';
import { activities, valueChain } from '@/lib/utils/company';

const heroItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const heroTile = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 20 } },
};

const statIcons = [Handshake, GraduationCap, Sprout, Globe];

/** Counts from 0 to `value` once the number scrolls into view. */
function StatCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1500, 1);
      setDisplay(Math.round((1 - Math.pow(1 - progress, 3)) * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return <span ref={ref}>{display.toLocaleString('fr-FR')}{suffix}</span>;
}

// The eight official CIPRESA business lines, in the order of the 2027–2031 presentation.
const activityIcons = [Handshake, Droplets, Sprout, Tractor, GraduationCap, Truck, Cpu, Factory];

const pillars = activities.map((a, i) => ({
  icon: activityIcons[i],
  title: a.title,
  description: a.text,
  details: a.details,
  href: a.href,
}));

const processIcons = [Leaf, Users, Droplets, Package, Store, TrendingUp];

const process = valueChain.map((v, i) => ({
  step: String(i + 1).padStart(2, '0'),
  title: v.title,
  desc: v.text,
  icon: processIcons[i],
}));

const engagement = [
  { icon: Shield, title: 'Qualité garantie', desc: 'Tous nos produits et formations sont certifiés et validés par nos experts agronomes.' },
  { icon: Sprout, title: 'Impact durable', desc: 'Nous promouvons des pratiques agricoles durables qui préservent l\'environnement.' },
  { icon: Hammer, title: 'Support continu', desc: 'Notre équipe reste à votre disposition pour vous accompagner dans la durée.' },
];

export default function ServicesPage() {
  return (
    <PageTransition>
      <div className="pt-[60px]">
        <section className="relative overflow-hidden bg-[#f6f5f2]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
            className="relative mx-auto max-w-[1520px] px-6 pb-16 pt-10 sm:px-10 lg:px-14 lg:pb-20 lg:pt-14"
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <div>
                <motion.span
                  variants={heroItem}
                  className="inline-flex items-center gap-2 bg-white px-3 py-1.5 text-[12px] font-semibold leading-none text-black ring-1 ring-black/10"
                >
                  <Leaf className="h-3.5 w-3.5 text-[#ff7a3d]" />
                  Services
                </motion.span>
                <motion.h1
                  variants={heroItem}
                  className="mt-6 font-display text-[36px] font-medium leading-[0.95] text-black sm:text-[50px] lg:text-[64px]"
                >
                  Huit métiers,
                  <span className="block">une seule chaîne de valeur</span>
                </motion.h1>
              </div>

              <motion.div variants={heroItem} className="max-w-[420px]">
                <p className="text-[15px] font-medium leading-[1.55] text-black">
                  Conseil, irrigation, plants, mécanisation, formation, logistique, digital et agro-industrie : des métiers habituellement dispersés entre plusieurs prestataires, réunis sous une même architecture.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-5">
                  <Link
                    href="/contact"
                    className="group inline-flex h-[42px] min-w-[154px] items-center justify-center gap-2 bg-black px-7 text-[13px] font-semibold text-white transition-colors hover:bg-cipresa-950"
                  >
                    Nous contacter
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                  </Link>
                  <a
                    href="#nos-services"
                    className="text-[13px] font-semibold text-black underline-offset-4 transition-colors hover:text-[#ff7a3d] hover:underline"
                  >
                    Voir nos services
                  </a>
                </div>
              </motion.div>
            </div>

            <motion.div
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } } }}
              className="mt-14 grid overflow-hidden bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:grid-cols-[1.05fr_0.95fr_0.95fr]"
            >
              <motion.div variants={heroTile} className="relative min-h-[150px] overflow-hidden bg-[#ff7a3d] px-8 py-7 text-white">
                <div
                  aria-hidden="true"
                  className="absolute -bottom-24 right-6 h-[210px] w-[210px] rounded-full border border-white/35 opacity-70"
                  style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
                />
                <p className="relative text-[42px] font-black leading-none">{pillars.length}</p>
                <p className="relative mt-1 max-w-[220px] text-[14px] font-medium leading-tight">
                  Métiers complémentaires, du conseil à l&apos;agro-industrie
                </p>
                <Leaf className="absolute right-[30%] top-10 h-5 w-5 fill-white text-white" />
              </motion.div>

              <motion.div variants={heroTile} className="border-t border-gray-200 px-7 py-7 md:border-l md:border-t-0 lg:px-8">
                <p className="text-[34px] font-black leading-none text-black">{process.length}</p>
                <div className="my-5 h-px bg-gray-200" />
                <p className="max-w-[230px] text-[12px] font-medium leading-tight text-black">
                  Étapes : diagnostiquer, concevoir, équiper, approvisionner, exécuter, piloter
                </p>
              </motion.div>

              <motion.div variants={heroTile} className="border-t border-gray-200 md:border-l md:border-t-0">
                <Link href="/contact" className="group flex h-full flex-col justify-between gap-6 px-7 py-7 transition-colors duration-500 hover:bg-black lg:px-8">
                  <p className="text-[18px] font-semibold leading-tight text-black transition-colors duration-500 group-hover:text-white">
                    Un seul partenaire
                  </p>
                  <div className="flex items-end justify-between gap-5">
                    <p className="max-w-[210px] text-[12px] font-medium leading-tight text-black transition-colors duration-500 group-hover:text-white/80">
                      Du diagnostic au suivi des performances de votre exploitation
                    </p>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff7a3d] text-white transition-transform duration-500 group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <section id="nos-services" className="scroll-mt-20 bg-white">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid gap-8 border-t border-black pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16"
            >
              <motion.h2 variants={heroItem} className="font-display text-[28px] font-medium leading-[0.95] text-black sm:text-[38px] lg:text-[46px]">
                Nos huit métiers
                <span className="block">complémentaires</span>
              </motion.h2>
              <motion.p variants={heroItem} className="max-w-[420px] text-[15px] font-medium leading-[1.55] text-black">
                L&apos;intégration réduit les ruptures entre conception, mise en œuvre, approvisionnement, formation et suivi. Choisissez un métier ou combinez-les.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
              className="mt-14 grid gap-px overflow-hidden bg-gray-200 shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200 sm:grid-cols-2 lg:grid-cols-4"
            >
              {pillars.map((pillar, i) => (
                <motion.div key={pillar.title} variants={heroTile} className="h-full">
                  <Link
                    href={pillar.href}
                    className="group relative flex h-full min-h-[440px] flex-col overflow-hidden bg-white px-7 py-8 text-black transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#ff7a3d] hover:text-white lg:px-8"
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-28 -right-16 h-[230px] w-[230px] translate-y-10 rounded-full border border-white/35 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-70"
                      style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
                    />

                    <div className="relative flex items-start justify-between gap-6">
                      <p className="text-[34px] font-black leading-none">{String(i + 1).padStart(2, '0')}</p>
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 transition-colors duration-500 group-hover:border-white/50">
                        <pillar.icon className="h-5 w-5 stroke-[1.7]" />
                      </span>
                    </div>

                    <h3 className="relative mt-10 text-[18px] font-semibold leading-tight">{pillar.title}</h3>
                    <p className="relative mt-3 text-[13px] font-medium leading-[1.5] text-black/70 transition-colors duration-500 group-hover:text-white/90">
                      {pillar.description}
                    </p>

                    <ul className="relative mt-6 space-y-2">
                      {pillar.details.map((d) => (
                        <li key={d} className="flex items-center gap-2.5 text-[12px] font-medium">
                          <span className="h-1.5 w-1.5 shrink-0 bg-[#ff7a3d] transition-colors duration-500 group-hover:bg-white" />
                          {d}
                        </li>
                      ))}
                    </ul>

                    <div className="relative mt-auto pt-8">
                      <div className="mb-5 h-px bg-gray-200 transition-colors duration-500 group-hover:bg-white/35" />
                      <div className="flex items-center justify-between gap-5">
                        <span className="text-[12px] font-semibold">En savoir plus</span>
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff7a3d] text-white transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-[#ff7a3d]">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="bg-[#f6f5f2]">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid gap-8 border-t border-black pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16"
            >
              <motion.h2 variants={heroItem} className="font-display text-[28px] font-medium leading-[0.95] text-black sm:text-[38px] lg:text-[46px]">
                Chaîne de valeur
                <span className="block">en {process.length} étapes</span>
              </motion.h2>
              <motion.p variants={heroItem} className="max-w-[420px] text-[15px] font-medium leading-[1.55] text-black">
                Un même interlocuteur de l&apos;étude jusqu&apos;au pilotage, pour une exécution cohérente et mesurable.
              </motion.p>
            </motion.div>

            <div className="relative mt-14">
              {/* Timeline rail that draws itself across the steps */}
              <div aria-hidden="true" className="relative mb-6 hidden h-3 lg:block">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-black/10" />
                <motion.div
                  className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#ff7a3d]"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: 'left' }}
                />
                <div className="absolute inset-0 grid grid-cols-6">
                  {process.map((item, i) => (
                    <motion.span
                      key={item.step}
                      className="ml-7 h-3 w-3 rounded-full bg-[#ff7a3d] ring-4 ring-[#f6f5f2]"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.25 + i * 0.25 }}
                    />
                  ))}
                </div>
              </div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
                className="grid gap-px overflow-hidden bg-gray-200 shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200 sm:grid-cols-2 lg:grid-cols-6"
              >
                {process.map((item) => (
                  <motion.div
                    key={item.step}
                    variants={heroTile}
                    className="group relative flex min-h-[260px] flex-col overflow-hidden bg-white px-7 py-8"
                  >
                    <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#ff7a3d] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-[34px] font-black leading-none text-black transition-colors duration-500 group-hover:text-[#ff7a3d]">{item.step}</p>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff7a3d]/10 text-[#ff7a3d] transition-all duration-500 group-hover:rotate-[-8deg] group-hover:bg-[#ff7a3d] group-hover:text-white">
                        <item.icon className="h-4 w-4 stroke-[1.8]" />
                      </span>
                    </div>
                    <div className="mt-auto pt-12">
                      <h3 className="text-[18px] font-semibold leading-tight text-black">{item.title}</h3>
                      <div className="my-5 h-px bg-gray-200" />
                      <p className="text-[12px] font-medium leading-tight text-black/80">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-white">
          {/* CIPRESA logo as a faint watermark, as on the home page */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -right-[14%] my-auto h-[460px] w-[690px] select-none opacity-[0.05] grayscale sm:h-[560px] sm:w-[840px] lg:-right-[6%]"
            initial={{ scale: 0.94, rotate: -4 }}
            whileInView={{ scale: 1, rotate: -4 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src="/images/logo.png" alt="" fill sizes="840px" className="object-contain" />
          </motion.div>

          <div className="relative mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid gap-8 border-t border-black pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16"
            >
              <motion.h2 variants={heroItem} className="font-display text-[28px] font-medium leading-[0.95] text-black sm:text-[38px] lg:text-[46px]">
                Pourquoi
                <span className="block">nous choisir</span>
              </motion.h2>
              <motion.p variants={heroItem} className="max-w-[420px] text-[15px] font-medium leading-[1.55] text-black">
                Des engagements forts pour une agriculture performante et durable.
              </motion.p>
            </motion.div>

            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
              className="mt-14 grid gap-px overflow-hidden bg-gray-200 shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200 md:grid-cols-3"
            >
              {engagement.map((item, i) => {
                const featured = i === 0;
                return (
                  <motion.li
                    key={item.title}
                    variants={heroTile}
                    className={`group relative flex min-h-[300px] flex-col overflow-hidden px-7 py-8 lg:px-8 ${
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
                      <p className={`max-w-[300px] text-[13px] font-medium leading-[1.5] ${featured ? 'text-white/90' : 'text-black/70'}`}>
                        {item.desc}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          </div>
        </section>

        <section className="bg-[#f6f5f2]">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid gap-8 border-t border-black pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16"
            >
              <motion.h2 variants={heroItem} className="font-display text-[28px] font-medium leading-[0.95] text-black sm:text-[38px] lg:text-[46px]">
                Nos chiffres
                <span className="block">clés</span>
              </motion.h2>
              <motion.p variants={heroItem} className="max-w-[420px] text-[15px] font-medium leading-[1.55] text-black">
                Des resultats concrets qui mesurent notre engagement aupres des acteurs agricoles.
              </motion.p>
            </motion.div>

            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
              className="mt-14 grid grid-cols-2 gap-px overflow-hidden bg-gray-200 shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200 lg:grid-cols-4"
            >
              {stats.map((stat, i) => {
                const featured = i === 0;
                const Icon = statIcons[i % statIcons.length];
                return (
                  <motion.li
                    key={stat.label}
                    variants={heroTile}
                    className={`group relative flex min-h-[210px] flex-col overflow-hidden px-6 py-7 lg:min-h-[230px] lg:px-8 ${
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
                      <Icon className="h-4 w-4 stroke-[1.8]" />
                    </span>
                    <div className="relative mt-auto pt-10">
                      <p className="text-[26px] font-black leading-none sm:text-[36px] lg:text-[42px]">
                        <StatCounter value={stat.value} suffix={stat.suffix} />
                      </p>
                      <p className={`mt-2 text-[13px] font-medium leading-tight ${featured ? 'text-white/90' : 'text-black/70'}`}>{stat.label}</p>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
