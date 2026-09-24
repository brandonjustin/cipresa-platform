import { NextResponse } from 'next/server';
import { nokashProvider } from '@/lib/payments/nokash';
import { processPaymentUpdate } from '@/lib/payments/fulfillment';
import { getClientIp, isRateLimited } from '@/lib/rate-limit';

interface NokashCallbackBody {
  id?: string;
  status?: string;
  amount?: number;
  phone?: string;
  orderId?: string;
}

/**
 * NOKASH's callback_url only fires for production keys (sandbox has no
 * webhooks at all — see src/app/api/payments/nokash/status/route.ts for the
 * polling fallback used during sandbox testing). No signature scheme is
 * documented for this callback, so its body is never trusted directly —
 * receiving it just triggers a fresh status-request call against NOKASH,
 * and that verified result is what actually gets applied to the order.
 */
export async function POST(request: Request) {
  if (isRateLimited(`nokash-webhook:${getClientIp(request)}`, 60, 60_000)) {
    return NextResponse.json({ ok: false, error: 'rate limited' }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as NokashCallbackBody | null;
  if (!body?.orderId || !body?.id) {
    return NextResponse.json({ ok: false, error: 'missing orderId/id' }, { status: 400 });
  }

  const verified = await nokashProvider.checkStatus(body.id);
  await processPaymentUpdate(body.orderId, verified);

  return NextResponse.json({ ok: true });
}
