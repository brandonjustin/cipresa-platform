export function formatCurrency(amount: number, currency: string = 'XAF'): string {
  const currencies: Record<string, { locale: string; symbol: string }> = {
    XAF: { locale: 'fr-FR', symbol: 'CFA' },
    XOF: { locale: 'fr-FR', symbol: 'CFA' },
    USD: { locale: 'en-US', symbol: '$' },
    EUR: { locale: 'fr-FR', symbol: '€' },
    GBP: { locale: 'en-GB', symbol: '£' },
    NGN: { locale: 'en-NG', symbol: '₦' },
    KES: { locale: 'en-KE', symbol: 'KSh' },
    ZAR: { locale: 'en-ZA', symbol: 'R' },
  };

  const resolvedCurrency = currencies[currency] ? currency : 'XAF';
  const config = currencies[resolvedCurrency];

  if (resolvedCurrency === 'XAF' || resolvedCurrency === 'XOF') {
    return `${config.symbol}${amount.toLocaleString(config.locale)}`;
  }

  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: resolvedCurrency,
    }).format(amount);
  } catch {
    return `${config.symbol}${amount.toFixed(2)}`;
  }
}

export function formatDate(date: string, style: 'short' | 'long' | 'relative' = 'short'): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  if (style === 'relative') {
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days} jours`;
    if (days < 30) return `Il y a ${Math.floor(days / 7)} semaines`;
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  if (style === 'long') {
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function ratingToStars(rating: number): { full: number; half: boolean; empty: number } {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return { full, half, empty };
}
