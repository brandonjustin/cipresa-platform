'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, ChevronDown, Mail, Users, Target, Heart, GraduationCap, ArrowUpRight, Wallet } from 'lucide-react';
import { PageTransition } from '@/components/animations/motion-components';
import { cn } from '@/lib/utils/cn';

const openPositions = [
  {
    id: '1',
    title: 'Formateur en Agronomie',
    department: 'Formation',
    location: 'Yaoundé, Cameroun',
    type: 'Temps plein',
    salary: 'Competitif',
    postedAt: '2024-05-01',
    description: 'Nous recherchons un formateur passionné pour dispenser nos formations en agronomie et accompagnement technique des agriculteurs.',
    requirements: [
      'Diplôme en agronomie ou domaine connexe (Bac+5 minimum)',
      '5+ ans d\'expérience dans le conseil agricole',
      'Excellentes compétences pédagogiques et de communication',
      'Maîtrise des techniques agricoles modernes',
      'Disponible pour des déplacements terrain',
    ],
    benefits: ['Salaire compétitif', 'Formation continue', 'Véhicule de fonction', 'Téléphone professionnel'],
  },
  {
    id: '2',
    title: 'Développeur Full Stack',
    department: 'Tech & Digital',
    location: 'Yaoundé / Remote',
    type: 'Temps plein',
    salary: 'Competitif',
    postedAt: '2024-05-10',
    description: 'Renforcez notre équipe technique pour développer et maintenir notre plateforme e-learning et e-commerce.',
    requirements: [
      'Bac+5 en informatique ou équivalent',
      'Maîtrise de React, Next.js et TypeScript',
      'Expérience avec les bases de données (PostgreSQL, Supabase)',
      'Connaissance des API REST et architectures modernes',
      'Sens du travail en équipe et autonomie',
    ],
    benefits: ['Salaire compétitif', 'Travail hybride', 'Équipement high-tech', 'Formation continue'],
  },
  {
    id: '3',
    title: 'Commercial Terrain',
    department: 'Ventes & Marketing',
    location: 'Douala, Cameroun',
    type: 'Temps plein',
    salary: 'Fixe + Commissions',
    postedAt: '2024-04-15',
    description: 'Développez notre portefeuille clients et promouvez nos solutions agricoles auprès des coopératives et institutions.',
    requirements: [
      'Bac+3 en commerce ou marketing',
      '3+ ans d\'expérience dans la vente B2B',
      'Connaissance du secteur agricole',
      'Excellent relationnel et sens de la négociation',
      'Permis de conduire B',
    ],
    benefits: ['Fixe + commissions attractives', 'Véhicule de fonction', 'Téléphone + forfait', 'Primes sur objectifs'],
  },
  {
    id: '4',
    title: 'Community Manager',
    department: 'Marketing Digital',
    location: 'Yaoundé, Cameroun',
    type: 'CDD (6 mois)',
    salary: 'Competitif',
    postedAt: '2024-05-15',
    description: 'Animez notre communauté digitale et renforcez notre présence sur les réseaux sociaux.',
    requirements: [
      'Bac+3 en communication digitale',
      'Maîtrise des réseaux sociaux (Facebook, Instagram, LinkedIn, TikTok)',
      'Créativité et sens du storytelling',
      'Capacité à produire du contenu photo/vidéo',
      'Passion pour l\'agriculture et le développement rural',
    ],
    benefits: ['Salaire compétitif', 'Travail flexible', 'Équipement professionnel', 'Formation'],
  },
];

const values = [
  { icon: Target, title: 'Impact', description: 'Nous mesurons notre succès à l\'impact positif que nous créons dans les communautés agricoles.' },
  { icon: Heart, title: 'Passion', description: 'Animés par une passion commune pour l\'agriculture et le développement de l\'Afrique.' },
  { icon: Users, title: 'Esprit d\'équipe', description: 'La collaboration et l\'entraide sont au coeur de notre culture d\'entreprise.' },
  { icon: GraduationCap, title: 'Apprentissage', description: 'Nous investissons dans la formation continue de nos collaborateurs.' },
];

const departments = Array.from(new Set(openPositions.map((p) => p.department)));

const heroItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const heroTile = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 20 } },
};

export default function CareersPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
                  <Briefcase className="h-3.5 w-3.5 text-[#ff7a3d]" />
                  Carrières
                </motion.span>
                <motion.h1
                  variants={heroItem}
                  className="mt-6 font-display text-[36px] font-medium leading-[0.95] text-black sm:text-[50px] lg:text-[64px]"
                >
                  Rejoignez
                  <span className="block">l&apos;équipe CIPRESA</span>
                </motion.h1>
              </div>

              <motion.div variants={heroItem} className="max-w-[420px]">
                <p className="text-[15px] font-medium leading-[1.55] text-black">
                  Contribuez à la révolution agricole africaine au sein d&apos;une équipe passionnée et dynamique.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-5">
                  <a
                    href="#postes"
                    className="group inline-flex h-[42px] min-w-[154px] items-center justify-center gap-2 bg-black px-7 text-[13px] font-semibold text-white transition-colors hover:bg-cipresa-950"
                  >
                    Voir les postes
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                  </a>
                  <a
                    href="#pourquoi-nous-rejoindre"
                    className="text-[13px] font-semibold text-black underline-offset-4 transition-colors hover:text-[#ff7a3d] hover:underline"
                  >
                    Pourquoi nous rejoindre
                  </a>
                </div>
              </motion.div>
            </div>

            <motion.div
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
              className="mt-14 grid overflow-hidden bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:grid-cols-[1.05fr_0.95fr_0.95fr]"
            >
              <motion.a
                variants={heroTile}
                href="#postes"
                className="group relative min-h-[150px] overflow-hidden bg-[#ff7a3d] px-8 py-7 text-white"
              >
                <div
                  aria-hidden="true"
                  className="absolute -bottom-24 right-6 h-[210px] w-[210px] rounded-full border border-white/35 opacity-70 transition-transform duration-700 group-hover:-translate-y-3"
                  style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
                />
                <p className="relative text-[42px] font-black leading-none">{openPositions.length}</p>
                <p className="relative mt-1 max-w-[220px] text-[14px] font-medium leading-tight">
                  Poste{openPositions.length > 1 ? 's' : ''} ouvert{openPositions.length > 1 ? 's' : ''} actuellement
                </p>
              </motion.a>

              <motion.div variants={heroTile} className="border-t border-gray-200 px-7 py-7 md:border-l md:border-t-0 lg:px-8">
                <p className="text-[34px] font-black leading-none text-black">{departments.length}</p>
                <div className="my-5 h-px bg-gray-200" />
                <p className="max-w-[240px] text-[12px] font-medium leading-tight text-black">
                  Départements qui recrutent : {departments.join(', ')}
                </p>
              </motion.div>

              <motion.div variants={heroTile} className="border-t border-gray-200 md:border-l md:border-t-0">
                <a
                  href="mailto:cipresaconsulting@gmail.com?subject=Candidature%20spontan%C3%A9e"
                  className="group flex h-full flex-col justify-between gap-6 px-7 py-7 transition-colors duration-500 hover:bg-black lg:px-8"
                >
                  <p className="text-[18px] font-semibold leading-tight text-black transition-colors duration-500 group-hover:text-white">
                    Candidature spontanée
                  </p>
                  <div className="flex items-end justify-between gap-5">
                    <p className="max-w-[210px] text-[12px] font-medium leading-tight text-black transition-colors duration-500 group-hover:text-white/80">
                      Envoyez-nous votre CV, même sans offre correspondante
                    </p>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff7a3d] text-white transition-transform duration-500 group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <section id="pourquoi-nous-rejoindre" className="scroll-mt-20 bg-white">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid gap-8 border-t border-black pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16"
            >
              <motion.h2 variants={heroItem} className="font-display text-[28px] font-medium leading-[0.95] text-black sm:text-[38px] lg:text-[46px]">
                Pourquoi
                <span className="block">nous rejoindre ?</span>
              </motion.h2>
              <motion.p variants={heroItem} className="max-w-[440px] text-[15px] font-medium leading-[1.55] text-black">
                CIPRESA Consulting est bien plus qu&apos;une entreprise - nous sommes une mission. Rejoindre notre équipe, c&apos;est contribuer à transformer l&apos;agriculture africaine.
              </motion.p>
            </motion.div>

            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
              className="mt-14 grid gap-px overflow-hidden bg-gray-200 shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200 sm:grid-cols-2 lg:grid-cols-4"
            >
              {values.map((value, i) => (
                <motion.li
                  key={value.title}
                  variants={heroTile}
                  className="group relative flex min-h-[280px] flex-col overflow-hidden bg-white px-7 py-8 text-black transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#ff7a3d] hover:text-white lg:px-8"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-28 -right-16 h-[230px] w-[230px] translate-y-10 rounded-full border border-white/35 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-70"
                    style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
                  />
                  <div className="relative flex items-start justify-between gap-6">
                    <p className="text-[34px] font-black leading-none">{String(i + 1).padStart(2, '0')}</p>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 transition-colors duration-500 group-hover:border-white/50">
                      <value.icon className="h-5 w-5 stroke-[1.7]" />
                    </span>
                  </div>
                  <div className="relative mt-auto pt-14">
                    <h3 className="text-[18px] font-semibold leading-tight">{value.title}</h3>
                    <div className="my-5 h-px bg-gray-200 transition-colors duration-500 group-hover:bg-white/35" />
                    <p className="text-[13px] font-medium leading-[1.5] text-black/70 transition-colors duration-500 group-hover:text-white/90">
                      {value.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>

        <section id="postes" className="scroll-mt-20 bg-[#f6f5f2]">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid gap-8 border-t border-black pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16"
            >
              <motion.h2 variants={heroItem} className="font-display text-[28px] font-medium leading-[0.95] text-black sm:text-[38px] lg:text-[46px]">
                Postes
                <span className="block">ouverts</span>
              </motion.h2>
              <motion.div variants={heroItem} className="max-w-[420px]">
                <p className="text-[15px] font-medium leading-[1.55] text-black">
                  {openPositions.length} poste{openPositions.length > 1 ? 's' : ''} disponible{openPositions.length > 1 ? 's' : ''}. Cliquez sur une offre pour voir le détail et postuler.
                </p>
                <a
                  href="mailto:cipresaconsulting@gmail.com?subject=Candidature%20spontan%C3%A9e"
                  className="group mt-7 inline-flex h-[42px] items-center justify-center gap-2 border border-black/20 bg-white px-6 text-[13px] font-semibold text-black transition-colors hover:border-black hover:bg-black hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                  Candidature spontanée
                </a>
              </motion.div>
            </motion.div>

            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
              className="mt-14 grid gap-px overflow-hidden bg-gray-200 shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200"
            >
              {openPositions.map((job, idx) => {
                const open = expandedId === job.id;
                const panelId = `poste-${job.id}`;
                return (
                  <motion.li key={job.id} variants={heroTile} layout className="relative bg-white">
                    <span
                      className={cn(
                        'absolute inset-y-0 left-0 w-1 origin-top bg-[#ff7a3d] transition-transform duration-500',
                        open ? 'scale-y-100' : 'scale-y-0'
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setExpandedId(open ? null : job.id)}
                      aria-expanded={open}
                      aria-controls={panelId}
                      className="group flex w-full items-center gap-5 px-6 py-6 text-left transition-colors hover:bg-[#fbfaf8] sm:gap-8 lg:px-8"
                    >
                      <span
                        className={cn(
                          'hidden w-10 shrink-0 text-[28px] font-black leading-none transition-colors duration-300 sm:block',
                          open ? 'text-[#ff7a3d]' : 'text-black/20 group-hover:text-[#ff7a3d]'
                        )}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                          <h3 className="text-[18px] font-semibold leading-tight text-black">{job.title}</h3>
                          <span className="bg-[#f6f5f2] px-2.5 py-1 text-[11px] font-semibold leading-none text-black">{job.department}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12px] font-medium text-black/60">
                          <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[#ff7a3d]" /> {job.location}</span>
                          <span className="inline-flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5 text-[#ff7a3d]" /> {job.type}</span>
                          <span className="inline-flex items-center gap-1.5"><Wallet className="h-3.5 w-3.5 text-[#ff7a3d]" /> {job.salary}</span>
                        </div>
                      </div>
                      <span
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-500',
                          open ? 'rotate-180 bg-[#ff7a3d] text-white' : 'border border-black/15 text-black group-hover:border-black'
                        )}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          id={panelId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="grid gap-8 border-t border-gray-200 px-6 pb-8 pt-7 sm:pl-[88px] lg:grid-cols-[1.2fr_1fr] lg:pl-24 lg:pr-8">
                            <div>
                              <h4 className="text-[12px] font-semibold text-black/50">Description</h4>
                              <p className="mt-2 text-[14px] font-medium leading-[1.6] text-black">{job.description}</p>

                              <h4 className="mt-7 text-[12px] font-semibold text-black/50">Prérequis</h4>
                              <ul className="mt-3 space-y-2">
                                {job.requirements.map((req) => (
                                  <li key={req} className="flex items-start gap-3 text-[13px] font-medium leading-snug text-black/80">
                                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-[#ff7a3d]" />
                                    {req}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="flex flex-col">
                              <h4 className="text-[12px] font-semibold text-black/50">Avantages</h4>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {job.benefits.map((b) => (
                                  <span key={b} className="bg-[#ff7a3d]/10 px-3 py-1.5 text-[12px] font-semibold leading-none text-[#c2521f]">
                                    {b}
                                  </span>
                                ))}
                              </div>
                              <a
                                href={`mailto:cipresaconsulting@gmail.com?subject=${encodeURIComponent(`Candidature - ${job.title}`)}`}
                                className="group/btn relative mt-8 inline-flex h-[48px] w-fit items-center justify-center gap-2 overflow-hidden bg-[#ff7a3d] px-7 text-[13px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(255,122,61,0.35)] lg:mt-auto"
                              >
                                <span aria-hidden="true" className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/35 transition-[left] duration-700 ease-out group-hover/btn:left-[120%]" />
                                <span className="relative">Postuler à ce poste</span>
                                <ArrowUpRight className="relative h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-45" />
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
