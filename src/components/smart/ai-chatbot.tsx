'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Leaf, RotateCcw, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface BotAction {
  label: string;
  href: string;
  external?: boolean;
}

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  actions?: BotAction[];
}

const WHATSAPP_URL = 'https://wa.me/237656164060';

const createInitialMessage = (): Message => ({
  id: 'welcome',
  text: "🌱 Bonjour ! Je suis l'assistant agricole CIPRESA. Je peux vous aider à choisir une formation, trouver des produits, ou répondre à vos questions sur l'agriculture. Comment puis-je vous aider ?",
  isBot: true,
  timestamp: new Date(),
});

const quickReplies = [
  'Quelles formations proposez-vous ?',
  'Comment acheter des semences ?',
  "Prix des plants d'avocatier",
  'Contactez un expert',
];

export const OPEN_CHATBOT_EVENT = 'cipresa:open-chatbot';

const timeFormat = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' });

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [createInitialMessage()]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingReplies = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping]);

  useEffect(() => {
    const timeouts = pendingReplies.current;
    return () => timeouts.forEach(clearTimeout);
  }, []);

  // Lets other parts of the site (e.g. the contact page) open the chat.
  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener(OPEN_CHATBOT_EVENT, open);
    return () => window.removeEventListener(OPEN_CHATBOT_EVENT, open);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const focusId = setTimeout(() => inputRef.current?.focus(), 150);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(focusId);
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  const handleSend = (raw: string) => {
    const text = raw.trim();
    if (!text || isTyping) return;

    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, text, isBot: false, timestamp: new Date() }]);
    setInput('');
    setIsTyping(true);

    const timeoutId = setTimeout(() => {
      pendingReplies.current.delete(timeoutId);
      const reply = getBotResponse(text);
      setMessages((prev) => [...prev, { id: `b-${Date.now()}`, text: reply.text, actions: reply.actions, isBot: true, timestamp: new Date() }]);
      setIsTyping(false);
    }, 700 + Math.min(text.length * 12, 600));
    pendingReplies.current.add(timeoutId);
  };

  const reset = () => {
    pendingReplies.current.forEach(clearTimeout);
    pendingReplies.current.clear();
    setIsTyping(false);
    setMessages([createInitialMessage()]);
    setInput('');
    inputRef.current?.focus();
  };

  const askedQuestions = new Set(messages.filter((m) => !m.isBot).map((m) => m.text));
  const remainingQuickReplies = quickReplies.filter((q) => !askedQuestions.has(q));

  return (
    <>
      {/* Launcher */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsOpen(true)}
            aria-label="Ouvrir l'assistant CIPRESA"
            className="group fixed bottom-6 right-6 z-40 flex h-14 items-center gap-0 overflow-hidden bg-[#ff7a3d] pl-4 pr-4 text-white shadow-[0_18px_40px_rgba(255,122,61,0.4)] transition-all duration-300 hover:gap-2.5 hover:bg-black hover:pr-5"
          >
            <span className="relative flex h-6 w-6 items-center justify-center">
              <MessageCircle className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#ff7a3d] group-hover:ring-black" />
            </span>
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-[13px] font-semibold transition-all duration-300 group-hover:max-w-[160px]">
              Une question ?
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="Assistant CIPRESA"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 z-50 flex h-[600px] max-h-[calc(100vh-6rem)] w-[390px] max-w-[calc(100vw-2rem)] origin-bottom-right flex-col overflow-hidden bg-white font-[var(--font-poppins)] shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
          >
            {/* Header */}
            <div className="relative overflow-hidden bg-[#ff7a3d] px-5 py-4 text-white">
              <div
                aria-hidden="true"
                className="absolute -bottom-16 -right-8 h-[130px] w-[130px] rounded-full border border-white/35 opacity-70"
                style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '10px 10px' }}
              />
              <div className="relative flex items-center gap-3">
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#ff7a3d]">
                  <Leaf className="h-5 w-5 fill-current" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[#ff7a3d]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold leading-tight">Assistant CIPRESA</p>
                  <p className="mt-0.5 text-[12px] font-medium text-white/85">{isTyping ? 'Écrit…' : 'En ligne · répond en quelques secondes'}</p>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  aria-label="Recommencer la conversation"
                  title="Recommencer"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/15 hover:text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Fermer l'assistant"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto bg-[#f6f5f2] px-4 py-5" aria-live="polite">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn('flex flex-col', msg.isBot ? 'items-start' : 'items-end')}
                >
                  <div
                    className={cn(
                      'max-w-[85%] px-4 py-3 text-[13px] font-medium leading-[1.55]',
                      msg.isBot ? 'bg-white text-black shadow-[0_6px_20px_rgba(0,0,0,0.04)]' : 'bg-black text-white'
                    )}
                  >
                    {msg.text}
                  </div>
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-2 flex max-w-[85%] flex-wrap gap-1.5">
                      {msg.actions.map((action) =>
                        action.external ? (
                          <a
                            key={action.label}
                            href={action.href}
                            target={action.href.startsWith('http') ? '_blank' : undefined}
                            rel={action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="inline-flex items-center gap-1 bg-[#ff7a3d] px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-black"
                          >
                            {action.label}
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <Link
                            key={action.label}
                            href={action.href}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1 bg-[#ff7a3d] px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-black"
                          >
                            {action.label}
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        )
                      )}
                    </div>
                  )}
                  <span className="mt-1 px-1 text-[10px] font-medium text-black/35">{timeFormat.format(msg.timestamp)}</span>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1 self-start bg-white px-4 py-3.5 shadow-[0_6px_20px_rgba(0,0,0,0.04)]" aria-label="L'assistant écrit">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-[#ff7a3d]"
                      animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            {remainingQuickReplies.length > 0 && !isTyping && (
              <div className="flex gap-2 overflow-x-auto border-t border-gray-200 bg-white px-4 py-3 scrollbar-hide">
                {remainingQuickReplies.map((qr) => (
                  <button
                    key={qr}
                    type="button"
                    onClick={() => handleSend(qr)}
                    className="shrink-0 bg-[#f6f5f2] px-3 py-1.5 text-[12px] font-semibold text-black transition-colors hover:bg-black hover:text-white"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex items-center gap-2 border-t border-gray-200 bg-white p-3"
            >
              <label htmlFor="chatbot-input" className="sr-only">
                Posez votre question
              </label>
              <input
                id="chatbot-input"
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question..."
                autoComplete="off"
                className="h-11 flex-1 bg-[#f6f5f2] px-4 text-[13px] font-medium text-black ring-1 ring-transparent transition-all placeholder:text-black/35 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff7a3d]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                aria-label="Envoyer"
                className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#ff7a3d] text-white transition-colors hover:bg-black disabled:bg-black/15 disabled:text-black/40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

function getBotResponse(input: string): { text: string; actions?: BotAction[] } {
  const q = input.toLowerCase();
  if (q.includes('formation') || q.includes('cours') || q.includes('apprendre')) {
    return {
      text: 'Nous proposons des formations en 🌾 culture annuelle, 🥬 maraîchage, 🌴 cultures pérennes, 🐄 élevage, et 📋 gestion de projet. Explorez le catalogue complet ci-dessous !',
      actions: [
        { label: 'Voir les formations', href: '/courses' },
        { label: 'Parcours guidés', href: '/paths' },
      ],
    };
  }
  if (q.includes('semence') || q.includes('graine') || q.includes('acheter')) {
    return {
      text: '🛒 Vous pouvez acheter nos semences et plants directement sur notre boutique en ligne. Nous livrons dans tout le Cameroun. Les prix commencent à 500 CFA.',
      actions: [{ label: 'Ouvrir la boutique', href: '/marketplace' }],
    };
  }
  if (q.includes('avocat') || q.includes('avocatier')) {
    return {
      text: "🥑 Nos plants d'avocatier sont disponibles en plusieurs variétés : Hickson (1500 CFA), Both 7 (2000 CFA). Production en 2-3 ans, adaptés au climat camerounais. Parfait pour l'export !",
      actions: [{ label: 'Voir les plants', href: '/marketplace?q=avocat' }],
    };
  }
  if (q.includes('contact') || q.includes('expert') || q.includes('conseil')) {
    return {
      text: "📞 Vous pouvez nous joindre au +237 656 164 060 ou par email à cipresaconsulting@gmail.com. Notre équipe d'experts est à votre disposition du lundi au vendredi, 8h-18h.",
      actions: [
        { label: 'WhatsApp', href: WHATSAPP_URL, external: true },
        { label: 'Appeler', href: 'tel:+237656164060', external: true },
        { label: 'Page contact', href: '/contact' },
      ],
    };
  }
  if (q.includes('prix') || q.includes('tarif') || q.includes('coûte') || q.includes('coute')) {
    return {
      text: '💰 Nos cours gratuits sont accessibles sans frais. Les cours premium commencent à 100 CFA. Pour les produits, les prix varient selon les articles.',
      actions: [
        { label: 'Formations', href: '/courses' },
        { label: 'Boutique', href: '/marketplace' },
      ],
    };
  }
  if (q.includes('livraison') || q.includes('transport') || q.includes('delai') || q.includes('délai')) {
    return {
      text: '🚚 Nous livrons à Yaoundé et dans toutes les régions du Cameroun. Les délais varient de 24h à 72h selon votre localisation. Le paiement Mobile Money (MTN/Orange) est accepté.',
      actions: [{ label: 'Ouvrir la boutique', href: '/marketplace' }],
    };
  }
  return {
    text: "Merci pour votre question ! 🤝 Pour mieux vous aider, notre équipe est joignable directement. Vous pouvez aussi explorer nos formations et produits.",
    actions: [
      { label: 'WhatsApp', href: WHATSAPP_URL, external: true },
      { label: 'Formations', href: '/courses' },
    ],
  };
}
