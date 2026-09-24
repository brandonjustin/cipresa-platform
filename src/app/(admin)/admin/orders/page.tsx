import { Badge } from '@/components/ui/badge';
import { OrderStatusSelect } from '@/components/admin/order-status-select';
import { getAllOrdersForAdmin } from '@/lib/data/orders';
import { formatCurrency, formatDate } from '@/lib/utils/format';

const paymentStatusConfig: Record<string, { variant: 'success' | 'warning' | 'error' | 'default'; label: string }> = {
  paid: { variant: 'success', label: 'Payé' },
  pending: { variant: 'warning', label: 'En attente' },
  failed: { variant: 'error', label: 'Échoué' },
  refunded: { variant: 'default', label: 'Remboursé' },
};

export default async function AdminOrdersPage() {
  const orders = await getAllOrdersForAdmin();

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Commandes</h1>
        <p className="text-sm text-gray-500">{orders.length} commandes récentes</p>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Commande</th>
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Client</th>
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Articles</th>
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Montant</th>
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Paiement</th>
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Statut</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const payCfg = paymentStatusConfig[order.paymentStatus] || { variant: 'default' as const, label: order.paymentStatus };
              return (
                <tr key={order.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 px-5">
                    <p className="font-medium text-gray-900 dark:text-white">#{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt, 'short')}</p>
                  </td>
                  <td className="py-3 px-5 text-gray-500 whitespace-nowrap">{order.customerEmail || order.customerPhone || '—'}</td>
                  <td className="py-3 px-5 text-gray-500 max-w-[220px] truncate">{order.items.map((i) => i.name).join(', ')}</td>
                  <td className="py-3 px-5 font-semibold text-gray-900 dark:text-white whitespace-nowrap">{formatCurrency(order.total, order.currency)}</td>
                  <td className="py-3 px-5"><Badge variant={payCfg.variant} size="sm">{payCfg.label}</Badge></td>
                  <td className="py-3 px-5"><OrderStatusSelect orderId={order.id} status={order.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-center py-12 text-sm text-gray-500">Aucune commande pour le moment.</p>}
      </div>
    </>
  );
}
