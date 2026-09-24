import { formatCurrency } from '@/lib/utils/format';

const WRAPPER_STYLE = 'font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937;';
const BUTTON_STYLE = 'display: inline-block; background: #1f63b5; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;';

function wrapper(bodyHtml: string): string {
  return `<div style="${WRAPPER_STYLE}">
    <h1 style="color: #0c1c33; font-size: 20px;">CIPRESA</h1>
    ${bodyHtml}
    <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">CIPRESA Consulting — Agriculture au Cameroun et en Afrique</p>
  </div>`;
}

export function orderConfirmationEmail(params: {
  fullName: string;
  orderId: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  currency: string;
  siteUrl: string;
}) {
  const rows = params.items
    .map(
      (i) => `<tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${i.name}${i.quantity > 1 ? ` × ${i.quantity}` : ''}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">${formatCurrency(i.price * i.quantity, params.currency)}</td>
      </tr>`
    )
    .join('');

  return wrapper(`
    <p>Bonjour ${params.fullName},</p>
    <p>Votre commande <strong>#${params.orderId.slice(0, 8)}</strong> a été confirmée. Merci pour votre confiance !</p>
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">${rows}</table>
    <p style="font-weight: 600; text-align: right;">Total : ${formatCurrency(params.total, params.currency)}</p>
    <p style="margin-top: 24px;">
      <a href="${params.siteUrl}/dashboard/orders" style="${BUTTON_STYLE}">Voir ma commande</a>
    </p>
  `);
}

export function enrollmentConfirmationEmail(params: { fullName: string; courseTitle: string; courseSlug: string; siteUrl: string }) {
  return wrapper(`
    <p>Bonjour ${params.fullName},</p>
    <p>Vous avez maintenant accès à la formation <strong>${params.courseTitle}</strong>. Vous pouvez commencer dès maintenant !</p>
    <p style="margin-top: 24px;">
      <a href="${params.siteUrl}/course/${params.courseSlug}/learn" style="${BUTTON_STYLE}">Commencer la formation</a>
    </p>
  `);
}
