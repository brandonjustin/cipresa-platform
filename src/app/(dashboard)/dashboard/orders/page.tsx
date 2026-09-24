import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Package, ArrowUpRight, BookOpen, Smartphone, Truck, Receipt, MessageCircle } from 'lucide-react';
import { getVerifiedUserId } from '@/lib/supabase/server';
import { getUserOrders } from '@/lib/data/orders';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import { BgImage } from '@/components/ui/bg-image';

const statusConfig: Record<string, { label: string; className: string; dot: string }> = {
  completed: { label: 'Payé', className: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  pending: { label: 'En attente', className: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  processing: { label: 'En cours', className: 'bg-sky-50 text-sky-700', dot: 'bg-sky-500' },
  cancelled: { label: 'Annulé', className: 'bg-red-50 text-red-600', dot: 'bg-red-500' },
  refunded: { label: 'Remboursé', className: 'bg-black/5 text-black/60', dot: 'bg-black/40' },
};

const paymentLabels: Record<string, string> = {
  MTN_MOMO: 'MTN Mobile Money',
  ORANGE_MONEY: 'Orange Money',
};

export default async function OrdersPage() {
  // Middleware already verified the session for this route and forwarded the id.
  const userId = getVerifiedUserId();
  const user = userId ? { id: userId } : null;
  if (!user) redirect('/auth/login?next=/dashboard/orders');

  const orders = await getUserOrders(user.id);

  if (orders.length === 0) {
    return (
      <div className="relative overflow-hidden bg-white px-6 py-16 text-center shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:py-20">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-20 h-[220px] w-[220px] rounded-full border border-[#ff7a3d]/25 opacity-70"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,122,61,.35) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
        />
        <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ff7a3d] text-white">
          <Package className="h-7 w-7" />
        </span>
        <h2 className="relative mt-6 font-display text-[24px] font-medium leading-tight text-black sm:text-[28px]">Aucune commande pour le moment</h2>
        <p className="relative mx-auto mt-2 max-w-md text-[14px] font-medium leading-[1.6] text-black/60">
          Vous n&apos;avez pas encore passé de commande.
        </p>
        <div className="relative mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/marketplace"
            className="group inline-flex h-[44px] items-center gap-2 bg-black px-6 text-[13px] font-semibold text-white transition-colors hover:bg-[#ff7a3d]"
          >
            Voir la boutique
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </Link>
          <Link
            href="/courses"
            className="inline-flex h-[44px] items-center px-6 text-[13px] font-semibold text-black ring-1 ring-black/15 transition-colors hover:bg-[#f6f5f2]"
          >
            Explorer les formations
          </Link>
        </div>
      </div>
    );
  }

  const paidTotal = orders.filter((o) => o.status === 'completed').reduce((sum, o) => sum + o.total, 0);
  const currency = orders[0].currency;

  return (
    <div className="space-y-6">
      {/* Summary strip */}
      <div className="grid overflow-hidden bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:grid-cols-3">
        <div className="relative overflow-hidden bg-[#ff7a3d] px-6 py-6 text-white">
          <div
            aria-hidden="true"
            className="absolute -bottom-16 -right-10 h-[140px] w-[140px] rounded-full border border-white/35 opacity-70"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '10px 10px' }}
          />
          <Receipt className="relative h-5 w-5" />
          <p className="relative mt-5 text-[34px] font-black leading-none">{orders.length}</p>
          <p className="relative mt-2 text-[12px] font-medium text-white/85">Commande{orders.length > 1 ? 's' : ''} passée{orders.length > 1 ? 's' : ''}</p>
        </div>
        <div className="border-t border-gray-200 px-6 py-6 sm:border-l sm:border-t-0">
          <Package className="h-5 w-5 text-[#ff7a3d]" />
          <p className="mt-5 text-[34px] font-black leading-none text-black">{orders.filter((o) => o.status === 'completed').length}</p>
          <p className="mt-2 text-[12px] font-medium text-black/55">Payées</p>
        </div>
        <div className="border-t border-gray-200 px-6 py-6 sm:border-l sm:border-t-0">
          <Smartphone className="h-5 w-5 text-[#ff7a3d]" />
          <p className="mt-5 text-[26px] font-black leading-none text-black">{formatCurrency(paidTotal, currency)}</p>
          <p className="mt-2 text-[12px] font-medium text-black/55">Total payé</p>
        </div>
      </div>

      {/* Orders */}
      <ul className="space-y-5">
        {orders.map((order) => {
          const status = statusConfig[order.status] ?? { label: order.status, className: 'bg-black/5 text-black/60', dot: 'bg-black/40' };
          const reference = order.id.slice(0, 8).toUpperCase();
          const payment = paymentLabels[order.paymentMethod] ?? order.paymentMethod;
          const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
          return (
            <li key={order.id} className="bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff7a3d]/10 text-[#ff7a3d]">
                    <Receipt className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold text-black">
                      Commande <span className="font-mono tracking-wide">#{reference}</span>
                    </p>
                    <p className="mt-0.5 text-[12px] font-medium text-black/50">
                      {formatDate(order.createdAt, 'long')} · {itemCount} article{itemCount > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-semibold', status.className)}>
                  <span className={cn('h-1.5 w-1.5 rounded-full', status.dot)} />
                  {status.label}
                </span>
              </div>

              {/* Items */}
              <ul className="px-6">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-4 border-b border-gray-100 py-3.5 last:border-0">
                    <BgImage src={item.image} className="h-12 w-14 shrink-0 bg-[#f6f5f2]" sizes="160px" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold text-black">{item.name}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-[12px] font-medium text-black/50">
                        {item.type === 'course' ? <BookOpen className="h-3.5 w-3.5 text-[#ff7a3d]" /> : <Package className="h-3.5 w-3.5 text-[#ff7a3d]" />}
                        {item.type === 'course' ? 'Formation' : 'Produit'}
                        {item.quantity > 1 && (
                          <>
                            {' '}· {formatCurrency(item.price, order.currency)} × {item.quantity}
                          </>
                        )}
                      </p>
                    </div>
                    <p className="shrink-0 text-[14px] font-black text-black">{formatCurrency(item.price * item.quantity, order.currency)}</p>
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-[#fbfaf8] px-6 py-4">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12px] font-medium text-black/55">
                  {payment && (
                    <span className="inline-flex items-center gap-1.5">
                      <Smartphone className="h-3.5 w-3.5 text-[#ff7a3d]" /> {payment}
                    </span>
                  )}
                  {order.trackingNumber && (
                    <span className="inline-flex items-center gap-1.5">
                      <Truck className="h-3.5 w-3.5 text-[#ff7a3d]" /> Suivi : <span className="font-mono text-black">{order.trackingNumber}</span>
                    </span>
                  )}
                  {(order.status === 'pending' || order.status === 'cancelled') && (
                    <Link href="/contact" className="inline-flex items-center gap-1.5 font-semibold text-[#ff7a3d] hover:underline">
                      <MessageCircle className="h-3.5 w-3.5" /> Besoin d&apos;aide ?
                    </Link>
                  )}
                </div>
                <p className="flex items-baseline gap-2">
                  <span className="text-[12px] font-semibold text-black/50">Total</span>
                  <span className="text-[20px] font-black leading-none text-black">{formatCurrency(order.total, order.currency)}</span>
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
