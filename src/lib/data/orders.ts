import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { Order, OrderItem } from '@/types';

interface OrderRow {
  id: string;
  user_id: string;
  total: number;
  currency: string;
  status: Order['status'];
  payment_method: string | null;
  payment_status: Order['paymentStatus'];
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItemRow[];
}

interface OrderItemRow {
  id: string;
  item_type: OrderItem['type'];
  item_id: string;
  name: string;
  quantity: number;
  price: number;
  image: string | null;
}

function mapOrder(row: OrderRow): Order {
  return {
    id: row.id,
    userId: row.user_id,
    items: row.order_items.map((i) => ({
      id: i.id,
      type: i.item_type,
      itemId: i.item_id,
      name: i.name,
      quantity: i.quantity,
      price: Number(i.price),
      image: i.image ?? '',
    })),
    total: Number(row.total),
    currency: row.currency,
    status: row.status,
    paymentMethod: row.payment_method ?? '',
    paymentStatus: row.payment_status,
    trackingNumber: row.tracking_number ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return (data as unknown as OrderRow[]).map(mapOrder);
}

export interface AdminOrder extends Order {
  customerEmail?: string;
  customerPhone?: string;
}

export async function getAllOrdersForAdmin(): Promise<AdminOrder[]> {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error || !data) return [];
  return (data as unknown as (OrderRow & { customer_email: string | null; customer_phone: string | null })[]).map((row) => ({
    ...mapOrder(row),
    customerEmail: row.customer_email ?? undefined,
    customerPhone: row.customer_phone ?? undefined,
  }));
}
