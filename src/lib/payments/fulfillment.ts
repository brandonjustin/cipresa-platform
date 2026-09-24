import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email/resend';
import { orderConfirmationEmail, enrollmentConfirmationEmail } from '@/lib/email/templates';
import type { PaymentResult } from './types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function fulfillOrder(orderId: string) {
  const { data: order } = await supabaseAdmin.from('orders').select('id, user_id, total, currency').eq('id', orderId).single();
  if (!order) return;

  const { data: items } = await supabaseAdmin.from('order_items').select('*').eq('order_id', orderId);
  if (!items) return;

  const { data: profile } = await supabaseAdmin.from('profiles').select('email, full_name').eq('id', order.user_id).single();

  for (const item of items) {
    if (item.item_type === 'course') {
      await supabaseAdmin.from('entitlements').upsert(
        { user_id: order.user_id, course_id: item.item_id, source: 'purchase', order_id: order.id },
        { onConflict: 'user_id,course_id', ignoreDuplicates: true }
      );

      await supabaseAdmin.from('enrollments').upsert(
        { user_id: order.user_id, course_id: item.item_id },
        { onConflict: 'user_id,course_id', ignoreDuplicates: true }
      );

      if (profile) {
        const { data: course } = await supabaseAdmin.from('courses').select('title, slug').eq('id', item.item_id).single();
        if (course) {
          await sendEmail({
            to: profile.email,
            subject: `Accès débloqué : ${course.title}`,
            html: enrollmentConfirmationEmail({
              fullName: profile.full_name,
              courseTitle: course.title,
              courseSlug: course.slug,
              siteUrl: SITE_URL,
            }),
          });
        }
      }
    } else {
      // Best-effort stock decrement, floored at zero. The payment is already
      // captured at this point, so an oversold item can't be "undone" here —
      // it just needs the admin to notice and restock/refund. Not using an
      // atomic SQL decrement because a slightly-stale read here is an
      // acceptable tradeoff against the added complexity for a low-volume
      // physical-goods catalog.
      const { data: product } = await supabaseAdmin.from('products').select('stock').eq('id', item.item_id).single();
      if (product) {
        await supabaseAdmin
          .from('products')
          .update({ stock: Math.max(0, product.stock - item.quantity) })
          .eq('id', item.item_id);
      }
    }
  }

  if (profile) {
    await sendEmail({
      to: profile.email,
      subject: 'Confirmation de votre commande CIPRESA',
      html: orderConfirmationEmail({
        fullName: profile.full_name,
        orderId: order.id,
        items: items.map((i) => ({ name: i.name, quantity: i.quantity, price: Number(i.price) })),
        total: Number(order.total),
        currency: order.currency,
        siteUrl: SITE_URL,
      }),
    });
  }
}

async function markOrderConfirmed(orderId: string) {
  await supabaseAdmin.from('orders').update({ status: 'completed', payment_status: 'paid' }).eq('id', orderId);
  await fulfillOrder(orderId);
}

async function markOrderFailed(orderId: string, reason?: string) {
  await supabaseAdmin
    .from('orders')
    .update({ status: 'cancelled', payment_status: 'failed', notes: reason ?? null })
    .eq('id', orderId);
}

/**
 * Single entry point for reacting to a payment status change, called from
 * both the webhook route and the client-side status-poll route (sandbox
 * keys get no webhooks at all — see nokash.ts). Uses a compare-and-swap
 * update (`.neq('status', 'confirmed')`) so a transaction can only ever be
 * fulfilled once, no matter how many times a retried webhook or poll call
 * this with the same "confirmed" result.
 */
export async function processPaymentUpdate(orderId: string, result: PaymentResult) {
  const newStatus = result.status === 'confirmed' ? 'confirmed' : result.status === 'pending' ? 'pending' : 'failed';

  const { data: updated } = await supabaseAdmin
    .from('payment_transactions')
    .update({
      status: newStatus,
      ...(result.providerReference ? { provider_reference: result.providerReference } : {}),
      raw_payload: result.raw as never,
    })
    .eq('order_id', orderId)
    .neq('status', 'confirmed')
    .select('id')
    .maybeSingle();

  if (!updated) return;

  if (newStatus === 'confirmed') {
    await markOrderConfirmed(orderId);
  } else if (newStatus === 'failed') {
    await markOrderFailed(orderId, result.message);
  }
}
