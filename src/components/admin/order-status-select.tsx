'use client';

import { useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import { updateOrderStatus } from '@/lib/actions/admin/orders';

const statuses = [
  { value: 'pending', label: 'En attente' },
  { value: 'processing', label: 'En cours' },
  { value: 'completed', label: 'Payé' },
  { value: 'cancelled', label: 'Annulé' },
  { value: 'refunded', label: 'Remboursé' },
];

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const [value, setValue] = useState(status);
  const [isPending, startTransition] = useTransition();

  const handleChange = (newStatus: string) => {
    const previous = value;
    setValue(newStatus);
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, newStatus);
      } catch (err) {
        setValue(previous);
        toast.error(err instanceof Error ? err.message : 'Une erreur est survenue.');
      }
    });
  };

  return (
    <select
      value={value}
      disabled={isPending}
      onChange={(e) => handleChange(e.target.value)}
      className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
    >
      {statuses.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  );
}
