'use client';

import { useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import { updateUserRole } from '@/lib/actions/admin/users';

const roles = [
  { value: 'student', label: 'Étudiant' },
  { value: 'instructor', label: 'Instructeur' },
  { value: 'admin', label: 'Admin' },
  { value: 'superadmin', label: 'Super Admin' },
];

export function UserRoleSelect({ userId, role, disabled }: { userId: string; role: string; disabled?: boolean }) {
  const [value, setValue] = useState(role);
  const [isPending, startTransition] = useTransition();

  const handleChange = (newRole: string) => {
    const previous = value;
    setValue(newRole);
    startTransition(async () => {
      try {
        await updateUserRole(userId, newRole);
        toast.success('Rôle mis à jour.');
      } catch (err) {
        setValue(previous);
        toast.error(err instanceof Error ? err.message : 'Une erreur est survenue.');
      }
    });
  };

  return (
    <select
      value={value}
      disabled={disabled || isPending}
      onChange={(e) => handleChange(e.target.value)}
      className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
    >
      {roles.map((r) => (
        <option key={r.value} value={r.value}>{r.label}</option>
      ))}
    </select>
  );
}
