'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUp, ArrowUpRight, Facebook, Globe, Handshake, Instagram, Leaf, Linkedin, Mail, MapPin, MessageCircle, Phone, Youtube } from 'lucide-react';

const columns = [
  {
    title: 'Liens rapides',
    links: [
      { label: 'Accueil', href: '/' },
      { label: 'Formations', href: '/courses' },
      { label: 'Boutique', href: '/marketplace' },
      { label: 'Services', href: '/services' },
      { label: 'Projets', href: '/services' },
      { label: 'Ressources', href: '/blog' },
      { label: 'A propos', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Formations',
    links: [
      { label: 'Culture annuelle', href: '/courses' },
      { label: 'Culture maraichere', href: '/courses' },
      { label: 'Culture perenne', href: '/courses' },
      { label: 'Formation elevage', href: '/courses' },
      { label: 'Gestion de projet agricoles', href: '/courses' },
      { label: 'Certifications', href: '/courses' },
    ],
  },
  {
    title: 'Boutique',
    links: [
      { label: 'Semences', href: '/marketplace' },
      { label: 'Plants fruitiers', href: '/marketplace' },
      { label: 'Intrants & Engrais', href: '/marketplace' },
      { label: 'Equipements', href: '/marketplace' },
      { label: 'Irrigation', href: '/marketplace' },
      { label: 'Kits & Outils', href: '/marketplace' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Conseil agricole', href: '/services' },
      { label: 'Etudes de faisabilite', href: '/services' },
      { label: 'Projets cle en main', href: '/services' },
      { label: 'Suivi & Evaluation', href: '/services' },
      { label: 'Formation sur mesure', href: '/services' },
      { label: 'Maintenance', href: '/services' },
    ],
  },
];

const contacts = [
  { icon: MapPin, label: 'Yaounde, Carrefour Nkomayos', href: 'https://maps.google.com/?q=Carrefour+Nkomayos+Yaounde' },
  { icon: Phone, label: '+237 6 56 16 40 60', href: 'tel:+237656164060' },
  { icon: Mail, label: 'cipresaconsulting@gmail.com', href: 'mailto:cipresaconsulting@gmail.com' },
  { icon: Globe, label: 'cipresaconsulting.com', href: 'https://cipresaconsulting.com' },
];

const socials = [
  { icon: Facebook, label: 'Facebook' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Youtube, label: 'YouTube' },
  { icon: Linkedin, label: 'LinkedIn' },
];

const legalLinks = [
  { label: 'Mentions legales', href: '/terms' },
  { label: 'Politique de confidentialite', href: '/privacy' },
  { label: 'Conditions d utilisation', href: '/terms' },
];

export const Footer = () => {
  return (
    <footer className="bg-[#0f0f0f] text-white">
      <div className="bg-[linear-gradient(to_bottom,#f6f5f2_50%,#0f0f0f_50%)] text-black">
        <div className="mx-auto max-w-[1520px] px-6 sm:px-10 lg:px-14">
          <div className="group relative overflow-hidden bg-[#ff7a3d] px-6 py-7 text-white shadow-[0_18px_50px_rgba(0,0,0,0.08)] sm:px-8 lg:px-10 lg:py-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-32 right-[30%] hidden h-[200px] w-[200px] rounded-full border border-white/35 opacity-60 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-3 lg:block"
              style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
            />
            <Leaf aria-hidden="true" className="pointer-events-none absolute right-[42%] top-5 hidden h-4 w-4 fill-white text-white opacity-80 lg:block" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
              <div className="flex items-center gap-5">
                <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[#ff7a3d] transition-transform duration-500 group-hover:-rotate-12 sm:flex">
                  <Handshake className="h-6 w-6 stroke-[1.8]" />
                </span>
                <div>
                  <h2 className="font-display text-[22px] font-medium leading-tight sm:text-[26px] lg:text-[28px]">
                    Vous avez un projet agricole ? <span className="whitespace-nowrap">Parlons-en.</span>
                  </h2>
                  <p className="mt-1.5 text-[13px] font-medium leading-snug text-white/90">
                    Nos experts sont a votre ecoute pour transformer vos idees en succes durables.
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap gap-3">
                <a
                  href="https://wa.me/237656164060"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-[44px] items-center justify-center gap-2 bg-black px-6 text-[13px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-cipresa-950"
                >
                  <MessageCircle className="h-4 w-4" />
                  Discuter sur WhatsApp
                </a>
                <Link
                  href="/contact"
                  className="group/btn inline-flex h-[44px] items-center justify-center gap-2 bg-white px-6 text-[13px] font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-black hover:text-white"
                >
                  Nous contacter
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-45" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="relative mx-auto max-w-[1520px] px-6 pb-8 pt-16 sm:px-10 lg:px-14">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_3fr_1.2fr] lg:gap-10">
            <div>
              <Image src="/images/logo.png" alt="CIPRESA Consulting" width={160} height={70} className="h-12 w-auto brightness-0 invert" />
              <p className="mt-5 max-w-[300px] text-[13px] font-medium leading-[1.6] text-white/65">
                CIPRESA Consulting SARL accompagne les acteurs agricoles en Afrique de la formation a la mise en marche pour une agriculture moderne et rentable.
              </p>
              <div className="mt-6 flex gap-2">
                {socials.map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ff7a3d] hover:bg-[#ff7a3d] hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
              {columns.map((column) => (
                <div key={column.title}>
                  <h3 className="border-t border-white pt-4 text-[13px] font-semibold text-white">{column.title}</h3>
                  <ul className="mt-5 space-y-2.5">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="group inline-flex items-center gap-2 text-[13px] font-medium text-white/60 transition-colors duration-300 hover:text-white"
                        >
                          <span className="h-px w-0 bg-[#ff7a3d] transition-all duration-300 group-hover:w-3" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div>
              <h3 className="border-t border-white pt-4 text-[13px] font-semibold text-white">Contactez-nous</h3>
              <ul className="mt-5 space-y-3">
                {contacts.map(({ icon: Icon, label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="group flex items-center gap-3 text-[13px] font-medium text-white/65 transition-colors duration-300 hover:text-white"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 transition-colors duration-300 group-hover:border-[#ff7a3d] group-hover:bg-[#ff7a3d]">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="break-all">{label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p
            aria-hidden="true"
            className="pointer-events-none mt-16 select-none whitespace-nowrap font-display text-[22vw] font-medium leading-[0.8] tracking-tight text-white/[0.04] lg:text-[15vw] 2xl:text-[230px]"
          >
            CIPRESA
          </p>

          <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-[12px] font-medium text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} CIPRESA Consulting SARL - Tous droits reserves.</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {legalLinks.map((link) => (
                <Link key={link.label} href={link.href} className="transition-colors duration-300 hover:text-white">
                  {link.label}
                </Link>
              ))}
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                aria-label="Retour en haut"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff7a3d] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#ff7a3d]"
              >
                <ArrowUp className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
