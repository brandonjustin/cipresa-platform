import { Resend } from 'resend';

let client: Resend | null = null;

/**
 * Lazily constructed so the app still boots without RESEND_API_KEY set
 * (e.g. before that account exists) — callers should treat email sending
 * as best-effort and never let it block an order/entitlement from
 * completing. See sendEmail() below.
 */
function getClient(): Resend | null {
  if (client) return client;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  client = new Resend(apiKey);
  return client;
}

const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL || 'CIPRESA <onboarding@resend.dev>';

export async function sendEmail(params: { to: string; subject: string; html: string }) {
  const resend = getClient();
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY not configured — skipped "${params.subject}" to ${params.to}`);
    return;
  }

  try {
    await resend.emails.send({ from: FROM_ADDRESS, to: params.to, subject: params.subject, html: params.html });
  } catch (err) {
    // Never let a transactional email failure roll back a payment/order —
    // just log it so it's visible without breaking the user-facing flow.
    console.error('[email] send failed', err);
  }
}
