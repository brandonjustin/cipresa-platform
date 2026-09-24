import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { nokashProvider } from '@/lib/payments/nokash';
import { processPaymentUpdate } from '@/lib/payments/fulfillment';
import { isRateLimited } from '@/lib/rate-limit';

/**
 * Client-side polling fallback for payment status. Necessary because NOKASH
 * sandbox/test keys never call back_url at all (production-only feature per
 * their doc) — the checkout success screen polls this instead of waiting
 * on a webhook that will never arrive during development.
 */
export async function GET(request: Request) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  if (isRateLimited(`nokash-status:${user.id}`, 30, 60_000)) {
    return NextResponse.json({ error: 'rate limited' }, { status: 429 });
  }

  const orderId = new URL(request.url).searchParams.get('orderId');
  if (!orderId) return NextResponse.json({ error: 'missing orderId' }, { status: 400 });

  const { data: order } = await supabase
    .from('orders')
    .select('id, payment_status, notes, user_id')
    .eq('id', orderId)
    .single();
  if (!order || order.user_id !== user.id) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  if (order.payment_status === 'paid' || order.payment_status === 'failed') {
    return NextResponse.json({ status: order.payment_status, message: order.notes });
  }

  const { data: tx } = await supabase
    .from('payment_transactions')
    .select('provider_reference')
    .eq('order_id', orderId)
    .maybeSingle();
  if (!tx?.provider_reference) return NextResponse.json({ status: 'pending' });

  const result = await nokashProvider.checkStatus(tx.provider_reference);
  await processPaymentUpdate(orderId, result);

  return NextResponse.json({ status: result.status, message: result.message });
}
