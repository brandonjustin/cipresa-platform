import { supabaseAdmin } from '@/lib/supabase/admin';

export interface AdminStats {
  totalRevenue: number;
  totalUsers: number;
  totalCourses: number;
  totalOrders: number;
  monthlyRevenue: { month: string; revenue: number }[];
}

export async function getAdminStats(): Promise<AdminStats> {
  const [{ count: totalUsers }, { count: totalCourses }, { count: totalOrders }, { data: paidOrders }] = await Promise.all([
    supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('courses').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('total, created_at').eq('payment_status', 'paid'),
  ]);

  const totalRevenue = (paidOrders ?? []).reduce((sum, o) => sum + Number(o.total), 0);

  const monthlyMap = new Map<string, number>();
  for (const o of paidOrders ?? []) {
    const month = new Date(o.created_at as string).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
    monthlyMap.set(month, (monthlyMap.get(month) ?? 0) + Number(o.total));
  }

  return {
    totalRevenue,
    totalUsers: totalUsers ?? 0,
    totalCourses: totalCourses ?? 0,
    totalOrders: totalOrders ?? 0,
    monthlyRevenue: Array.from(monthlyMap.entries()).map(([month, revenue]) => ({ month, revenue })),
  };
}

export interface AdminOrderRow {
  id: string;
  customerLabel: string;
  itemsSummary: string;
  amount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface RawAdminOrderRow {
  id: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
  customer_phone: string | null;
  customer_email: string | null;
  order_items: { name: string }[];
}

export async function getRecentOrders(limit = 6): Promise<AdminOrderRow[]> {
  const { data } = await supabaseAdmin
    .from('orders')
    .select('id, total, status, payment_status, created_at, customer_phone, customer_email, order_items(name)')
    .order('created_at', { ascending: false })
    .limit(limit);

  return ((data ?? []) as unknown as RawAdminOrderRow[]).map((o) => ({
    id: o.id,
    customerLabel: o.customer_email || o.customer_phone || 'Client',
    itemsSummary: o.order_items.map((i) => i.name).join(', '),
    amount: Number(o.total),
    status: o.status,
    paymentStatus: o.payment_status,
    createdAt: o.created_at,
  }));
}
