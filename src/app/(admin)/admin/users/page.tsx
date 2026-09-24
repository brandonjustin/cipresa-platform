import { getVerifiedUserId } from '@/lib/supabase/server';
import { UserRoleSelect } from '@/components/admin/user-role-select';
import { getAllUsersForAdmin } from '@/lib/data/admin-users';
import { formatDate, getInitials } from '@/lib/utils/format';

export default async function AdminUsersPage() {
  const currentUserId = getVerifiedUserId();
  const users = await getAllUsersForAdmin();

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Utilisateurs</h1>
        <p className="text-sm text-gray-500">{users.length} comptes</p>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Utilisateur</th>
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Email</th>
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Inscrit le</th>
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Rôle</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="py-3 px-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-cipresa-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {getInitials(u.fullName)}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">{u.fullName}</span>
                  </div>
                </td>
                <td className="py-3 px-5 text-gray-500 whitespace-nowrap">{u.email}</td>
                <td className="py-3 px-5 text-gray-500 whitespace-nowrap">{formatDate(u.createdAt, 'short')}</td>
                <td className="py-3 px-5">
                  <UserRoleSelect userId={u.id} role={u.role} disabled={u.id === currentUserId} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="text-center py-12 text-sm text-gray-500">Aucun utilisateur pour le moment.</p>}
      </div>
    </>
  );
}
