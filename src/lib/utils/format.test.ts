import { describe, expect, it } from 'vitest';
import { formatCurrency, slugify, ratingToStars } from './format';

describe('formatCurrency', () => {
  it('formats XAF with the CFA symbol and no decimals', () => {
    expect(formatCurrency(15000, 'XAF')).toMatch(/^CFA15.000$/);
  });

  it('still formats the legacy XOF code with the CFA symbol', () => {
    expect(formatCurrency(15000, 'XOF')).toMatch(/^CFA15.000$/);
  });

  it('falls back to XAF for an unknown currency code', () => {
    expect(formatCurrency(1000, 'ZZZ')).toMatch(/^CFA1.000$/);
  });
});

describe('slugify', () => {
  it('lowercases, strips punctuation and hyphenates spaces', () => {
    expect(slugify("Élevage des Abeilles !")).toBe('levage-des-abeilles');
  });
});

describe('ratingToStars', () => {
  it('splits a rating into full/half/empty stars', () => {
    expect(ratingToStars(3.5)).toEqual({ full: 3, half: true, empty: 1 });
    expect(ratingToStars(4)).toEqual({ full: 4, half: false, empty: 1 });
  });
});
