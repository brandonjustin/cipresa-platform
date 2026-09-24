'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock, MessageCircle, Handshake, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils/cn';
import { PageTransition, AnimatedSection } from '@/components/animations/motion-components';
import { OPEN_CHATBOT_EVENT } from '@/components/smart/ai-chatbot';

const heroItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const heroTile = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 20 } },
};

const contactInfo = [
  { icon: Phone, label: 'Téléphone', value: '+237 656 164 060', href: 'tel:+237656164060' },
  { icon: Mail, label: 'Email', value: 'cipresaconsulting@gmail.com', href: 'mailto:cipresaconsulting@gmail.com' },
  { icon: MapPin, label: 'Adresse', value: 'Yaoundé, Cameroun' },
  { icon: Clock, label: 'Horaires', value: 'Lun - Ven: 8h00 - 18h00' },
];

const CONTACT_EMAIL = 'cipresaconsulting@gmail.com';

type FormFields = { name: string; email: string; subject: string; message: string };

function validate(values: FormFields): Partial<Record<keyof FormFields, string>> {
  const errors: Partial<Record<keyof FormFields, string>> = {};
  if (!values.name.trim()) errors.name = 'Indiquez votre nom.';
  if (!values.email.trim()) errors.email = 'Indiquez votre email.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Adresse email invalide.';
  if (!values.message.trim()) errors.message = 'Ecrivez votre message.';
  return errors;
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  multiline = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  multiline?: boolean;
}) {
  const id = `contact-${name}`;
  const base = cn(
    'w-full bg-[#f6f5f2] px-4 text-[14px] font-medium text-black ring-1 transition-all duration-300 placeholder:text-black/35 focus:bg-white focus:outline-none focus:ring-2',
    error ? 'ring-red-400 focus:ring-red-400' : 'ring-transparent hover:ring-black/15 focus:ring-[#ff7a3d]'
  );
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[12px] font-semibold text-black">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={6}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(base, 'resize-none py-3.5')}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(base, 'h-[48px]')}
        />
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[12px] font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });

  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({});

  const updateField = (field: keyof FormFields, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // No backend endpoint for contact messages yet: open the visitor's mail app
  // with the message pre-filled, addressed to CIPRESA.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(formState);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error('Merci de completer les champs indiques.');
      return;
    }
    const subject = formState.subject.trim() || 'Demande de contact';
    const body = `${formState.message.trim()}\n\n--\n${formState.name.trim()}\n${formState.email.trim()}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast.success('Votre messagerie s ouvre avec votre message.');
  };

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
                  <Handshake className="h-3.5 w-3.5 text-[#ff7a3d]" />
                  Contact
                </motion.span>
                <motion.h1
                  variants={heroItem}
                  className="mt-6 font-display text-[36px] font-medium leading-[0.95] text-black sm:text-[50px] lg:text-[64px]"
                >
                  Contactez-nous
                  <span className="block">parlons de votre projet</span>
                </motion.h1>
              </div>

              <motion.div variants={heroItem} className="max-w-[420px]">
                <p className="text-[15px] font-medium leading-[1.55] text-black">
                  Une question, un projet agricole ? Notre équipe est là pour vous accompagner.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-5">
                  <a
                    href="https://wa.me/237656164060"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex h-[42px] min-w-[154px] items-center justify-center gap-2 bg-black px-7 text-[13px] font-semibold text-white transition-colors hover:bg-[#ff7a3d]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Discuter sur WhatsApp
                  </a>
                  <a
                    href="#formulaire"
                    className="text-[13px] font-semibold text-black underline-offset-4 transition-colors hover:text-[#ff7a3d] hover:underline"
                  >
                    Ecrire un message
                  </a>
                </div>
              </motion.div>
            </div>

            <motion.div
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
              className="mt-12 grid overflow-hidden bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:grid-cols-3"
            >
              <motion.a
                variants={heroTile}
                href="tel:+237656164060"
                className="group relative min-h-[150px] overflow-hidden bg-[#ff7a3d] px-8 py-7 text-white"
              >
                <div
                  aria-hidden="true"
                  className="absolute -bottom-24 right-6 h-[210px] w-[210px] rounded-full border border-white/35 opacity-70 transition-transform duration-700 group-hover:-translate-y-3"
                  style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
                />
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/50 transition-transform duration-500 group-hover:rotate-[-12deg]">
                  <Phone className="h-4 w-4" />
                </span>
                <p className="relative mt-6 text-[22px] font-black leading-none">+237 656 164 060</p>
                <p className="relative mt-1.5 text-[12px] font-medium text-white/85">Appelez-nous directement</p>
              </motion.a>

              <motion.a
                variants={heroTile}
                href="mailto:cipresaconsulting@gmail.com"
                className="group relative border-t border-gray-200 px-7 py-7 transition-colors duration-500 hover:bg-black md:border-l md:border-t-0 lg:px-8"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff7a3d]/10 text-[#ff7a3d] transition-colors duration-500 group-hover:bg-[#ff7a3d] group-hover:text-white">
                  <Mail className="h-4 w-4" />
                </span>
                <p className="mt-6 break-all text-[16px] font-bold leading-tight text-black transition-colors duration-500 group-hover:text-white">
                  cipresaconsulting@gmail.com
                </p>
                <p className="mt-1.5 text-[12px] font-medium text-black/60 transition-colors duration-500 group-hover:text-white/70">Ecrivez-nous par email</p>
              </motion.a>

              <motion.div variants={heroTile} className="border-t border-gray-200 px-7 py-7 md:border-l md:border-t-0 lg:px-8">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff7a3d]/10 text-[#ff7a3d]">
                  <Clock className="h-4 w-4" />
                </span>
                <p className="mt-6 text-[16px] font-bold leading-tight text-black">Lun - Ven : 8h00 - 18h00</p>
                <p className="mt-1.5 text-[12px] font-medium text-black/60">Yaoundé, Cameroun</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <section id="formulaire" className="scroll-mt-20 bg-white">
          <div className="mx-auto max-w-[1520px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
              <AnimatedSection direction="left">
                <div className="border-t border-black pt-10">
                  <h2 className="font-display text-[28px] font-medium leading-[0.95] text-black sm:text-[38px] lg:text-[46px]">
                    Envoyez-nous
                    <span className="block">un message</span>
                  </h2>
                  <p className="mt-5 max-w-[460px] text-[15px] font-medium leading-[1.55] text-black">
                    Décrivez votre besoin, nous revenons vers vous rapidement.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Nom complet"
                      name="name"
                      placeholder="Votre nom"
                      value={formState.name}
                      error={errors.name}
                      onChange={(v) => updateField('name', v)}
                    />
                    <Field
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={formState.email}
                      error={errors.email}
                      onChange={(v) => updateField('email', v)}
                    />
                  </div>
                  <Field
                    label="Sujet"
                    name="subject"
                    placeholder="Sujet de votre message"
                    value={formState.subject}
                    error={errors.subject}
                    onChange={(v) => updateField('subject', v)}
                  />
                  <Field
                    label="Message"
                    name="message"
                    placeholder="Votre message..."
                    value={formState.message}
                    error={errors.message}
                    onChange={(v) => updateField('message', v)}
                    multiline
                  />
                  <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[12px] font-medium text-black/50">
                      Votre messagerie s&apos;ouvrira avec le message pret a envoyer.
                    </p>
                    <button
                      type="submit"
                      className="group relative inline-flex h-[48px] shrink-0 items-center justify-center gap-2 overflow-hidden bg-[#ff7a3d] px-8 text-[13px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(255,122,61,0.35)]"
                    >
                      <span aria-hidden="true" className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/35 transition-[left] duration-700 ease-out group-hover:left-[120%]" />
                      <span className="relative">Envoyer le message</span>
                      <Send className="relative h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </form>
              </AnimatedSection>

              <AnimatedSection direction="right">
                <div className="border-t border-black pt-10">
                  <h2 className="font-display text-[28px] font-medium leading-[0.95] text-black sm:text-[38px] lg:text-[46px]">
                    Nos
                    <span className="block">coordonnées</span>
                  </h2>
                </div>

                <ul className="mt-10 grid gap-px overflow-hidden bg-gray-200 shadow-[0_18px_50px_rgba(0,0,0,0.05)] ring-1 ring-gray-200 sm:grid-cols-2">
                  {contactInfo.map((item) => {
                    const content = (
                      <>
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff7a3d]/10 text-[#ff7a3d] transition-colors duration-500 group-hover:bg-[#ff7a3d] group-hover:text-white">
                          <item.icon className="h-4 w-4" />
                        </span>
                        <p className="mt-5 text-[12px] font-medium text-black/50">{item.label}</p>
                        <p className="mt-1 break-words text-[14px] font-semibold leading-snug text-black transition-colors duration-300 group-hover:text-[#ff7a3d]">
                          {item.value}
                        </p>
                      </>
                    );
                    return (
                      <li key={item.label} className="bg-white">
                        {item.href ? (
                          <a href={item.href} className="group relative block h-full px-6 py-6">
                            <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#ff7a3d] transition-transform duration-500 group-hover:scale-x-100" />
                            {content}
                          </a>
                        ) : (
                          <div className="group h-full px-6 py-6">{content}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>

                <div className="group relative mt-5 overflow-hidden bg-[#ff7a3d] p-7 text-white">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-24 -right-12 h-[210px] w-[210px] rounded-full border border-white/35 opacity-70 transition-transform duration-700 group-hover:-translate-y-3"
                    style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
                  />
                  <div className="relative flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#ff7a3d]">
                      <MessageCircle className="h-4 w-4" />
                    </span>
                    <h3 className="text-[18px] font-semibold leading-tight">Assistant virtuel</h3>
                  </div>
                  <p className="relative mt-4 max-w-[380px] text-[13px] font-medium leading-[1.55] text-white/90">
                    Notre assistant IA est disponible 24h/24 pour répondre à vos questions sur nos formations et produits.
                  </p>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new Event(OPEN_CHATBOT_EVENT))}
                    className="group/btn relative mt-6 inline-flex h-[42px] items-center justify-center gap-2 bg-black px-6 text-[13px] font-semibold text-white transition-colors hover:bg-white hover:text-black"
                  >
                    Discuter maintenant
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-45" />
                  </button>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
