'use server';

import { randomUUID } from 'node:crypto';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { nokashProvider } from '@/lib/payments/nokash';
import { processPaymentUpdate } from '@/lib/payments/fulfillment';
import { normalizeCameroonMobilePhone } from '@/lib/utils/phone';

export interface CheckoutItemInput {
  type: 'course' | 'product';
  itemId: string;
  quantity: number;
}

export interface CheckoutInput {
  items: CheckoutItemInput[];
  fullName: string;
  email: string;
  phone: string;
  mobileMoneyOperator: 'MTN_MOMO' | 'ORANGE_MONEY';
  address?: string;
  city?: string;
  notes?: string;
}

export interface CheckoutOutcome {
  orderId: string;
  requiresPayment: boolean;
  /** True when NOKASH rejected the payin immediately (e.g. bad phone format,
   * provider outage) — the order was created, but there's nothing to poll
   * for, so the client should go straight to the failure screen with
   * `failureReason` instead of entering the "waiting for confirmation" step. */
  paymentFailed?: boolean;
  failureReason?: string;
}

export async function createOrderAndInitiatePayment(input: CheckoutInput): Promise<CheckoutOutcome> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Vous devez être connecté pour passer commande.');
  if (input.items.length === 0) throw new Error('Votre panier est vide.');
  if (!input.phone) throw new Error('Un numéro de téléphone est requis pour le paiement Mobile Money.');
  // Re-validated here (not just in the form) since Nokash's Payin API rejects
  // the whole request if user_phone isn't shaped exactly like "2376XXXXXXXX"
  // — catching a stray "+", space, or missing country code before we ever
  // create an order is much clearer than surfacing their generic "format"
  // error after the fact.
  const normalizedPhone = normalizeCameroonMobilePhone(input.phone);
  if (!normalizedPhone) {
    throw new Error('Numéro de téléphone invalide. Utilisez un numéro Mobile Money camerounais (ex : 677123456).');
  }

  const courseIds = input.items.filter((i) => i.type === 'course').map((i) => i.itemId);
  const productIds = input.items.filter((i) => i.type === 'product').map((i) => i.itemId);

  const [{ data: courseRows }, { data: productRows }] = await Promise.all([
    courseIds.length
      ? supabase.from('courses').select('id, title, thumbnail, price, sale_price, currency, is_published').in('id', courseIds)
      : Promise.resolve({ data: [] as Array<Record<string, unknown>> }),
    productIds.length
      ? supabase.from('products').select('id, name, images, price, sale_price, currency, stock, is_published').in('id', productIds)
      : Promise.resolve({ data: [] as Array<Record<string, unknown>> }),
  ]);

  // Never trust client-submitted prices/stock — every line item is
  // re-priced from the database right here.
  const orderItems: { item_type: 'course' | 'product'; item_id: string; name: string; quantity: number; price: number; image: string }[] = [];
  let total = 0;

  for (const item of input.items) {
    if (item.type === 'course') {
      const course = courseRows?.find((c) => c.id === item.itemId) as
        | { id: string; title: string; thumbnail: string; price: number; sale_price: number | null; is_published: boolean }
        | undefined;
      if (!course || !course.is_published) throw new Error('Un des cours de votre panier n\'est plus disponible.');
      const price = Number(course.sale_price ?? course.price);
      orderItems.push({ item_type: 'course', item_id: course.id, name: course.title, quantity: 1, price, image: course.thumbnail });
      total += price;
    } else {
      const product = productRows?.find((p) => p.id === item.itemId) as
        | { id: string; name: string; images: string[]; price: number; sale_price: number | null; stock: number; is_published: boolean }
        | undefined;
      if (!product || !product.is_published) throw new Error('Un des produits de votre panier n\'est plus disponible.');
      const quantity = Math.max(1, item.quantity);
      if (product.stock < quantity) throw new Error(`Stock insuffisant pour "${product.name}".`);
      const price = Number(product.sale_price ?? product.price);
      orderItems.push({ item_type: 'product', item_id: product.id, name: product.name, quantity, price, image: product.images?.[0] ?? '' });
      total += price * quantity;
    }
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      total,
      currency: 'XAF',
      status: 'pending',
      payment_method: 'nokash',
      payment_status: 'pending',
      customer_phone: normalizedPhone,
      customer_email: input.email,
      shipping_address: input.address ? { fullName: input.fullName, address: input.address, city: input.city } : null,
      notes: input.notes || null,
    })
    .select('id')
    .single();
  if (orderError || !order) throw new Error(orderError?.message || 'Impossible de créer la commande.');

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems.map((i) => ({ ...i, order_id: order.id })));
  if (itemsError) throw new Error(itemsError.message);

  // Free-only cart (e.g. every item is a free course): nothing to charge,
  // fulfill immediately rather than round-tripping to Nokash for a 0 XAF payin.
  if (total === 0) {
    await processPaymentUpdate(order.id, { providerReference: '', status: 'confirmed', raw: { reason: 'zero_amount_order' } });
    return { orderId: order.id, requiresPayment: false };
  }

  const { error: txError } = await supabaseAdmin.from('payment_transactions').insert({
    order_id: order.id,
    provider: 'nokash',
    idempotency_key: randomUUID(),
    status: 'pending',
  });
  if (txError) throw new Error(txError.message);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const result = await nokashProvider.initiate({
    orderId: order.id,
    amount: total,
    currency: 'XAF',
    country: 'CM',
    phone: normalizedPhone,
    mobileMoneyOperator: input.mobileMoneyOperator,
    email: input.email,
    fullName: input.fullName,
    callbackUrl: `${siteUrl}/api/payments/nokash/webhook`,
  });

  await processPaymentUpdate(order.id, result);

  if (result.status === 'failed') {
    return { orderId: order.id, requiresPayment: true, paymentFailed: true, failureReason: result.message };
  }

  return { orderId: order.id, requiresPayment: true };
}
