/**
 * Normalizes a Cameroonian mobile number to the "2376XXXXXXXX"-shaped format
 * NOKASH's Payin API expects for CM_MOBILEMONEY (see NOKASH API Payin doc,
 * section I: user_phone example "2376XXXXXXXX"). Accepts the country code
 * with or without a leading "+", a local leading "0", or no prefix at all.
 * Returns null if the result isn't a plausible CM mobile number (237 + 9
 * digits starting with 6).
 */
export function normalizeCameroonMobilePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  const local = digits.startsWith('237') ? digits.slice(3) : digits.startsWith('0') ? digits.slice(1) : digits;
  if (!/^6\d{8}$/.test(local)) return null;
  return `237${local}`;
}
