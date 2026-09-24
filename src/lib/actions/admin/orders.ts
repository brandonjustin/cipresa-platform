'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/require-admin';
import { supabaseAdmin } from '@/lib/supabase/admin';

const VALID_STATUSES = ['pending', 'processing', 'completed', 'cancelled', 'refunded'];

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin();
  if (!VALID_STATUSES.includes(status)) throw new Error('Statut invalide.');

  const { error } = await supabaseAdmin.from('orders').update({ status }).eq('id', orderId);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/orders');
  revalidatePath('/dashboard/orders');
}

export async function updateOrderTracking(orderId: string, trackingNumber: string) {
  await requireAdmin();
  const { error } = await supabaseAdmin.from('orders').update({ tracking_number: trackingNumber || null }).eq('id', orderId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/orders');
}
