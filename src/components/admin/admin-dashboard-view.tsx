'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { DollarSign, Users, BookOpen, ShoppingCart, Star, Search, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils/format';
import type { AdminStats, AdminOrderRow } from '@/lib/data/admin-stats';
import type { Course } from '@/types';

const statusConfig: Record<string, { variant: 'success' | 'warning' | 'info' | 'error' | 'default'; label: string }> = {
  completed: { variant: 'success', label: 'Payé' },
  pending: { variant: 'warning', label: 'En attente' },
  processing: { variant: 'info', label: 'En cours' },
  cancelled: { variant: 'error', label: 'Annulé' },
  refunded: { variant: 'default', label: 'Remboursé' },
};

interface AdminDashboardViewProps {
  stats: AdminStats;
  recentOrders: AdminOrderRow[];
  courses: Course[];
}

export function AdminDashboardView({ stats, recentOrders, courses }: AdminDashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    const q = searchQuery.toLowerCase();
    return courses.filter(
      (c) => c.title.toLowerCase().includes(q) || c.category.name.toLowerCase().includes(q) || c.instructor.fullName.toLowerCase().includes(q)
    );
  }, [courses, searchQuery]);

  const maxRevenue = Math.max(1, ...stats.monthlyRevenue.map((m) => m.revenue));

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Vue d&apos;ensemble</h1>
          <p className="text-sm text-gray-500">Administration de la plateforme CIPRESA</p>
        </div>
        <Link href="/admin/courses/new">
          <Button size="sm" icon={Plus} iconPosition="left">Nouveau cours</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { icon: DollarSign, label: 'Revenus total', value: formatCurrency(stats.totalRevenue), bg: 'bg-blue-50 dark:bg-blue-950/50', iconColor: 'text-blue-600 dark:text-blue-400' },
          { icon: Users, label: 'Utilisateurs', value: stats.totalUsers.toLocaleString('fr-FR'), bg: 'bg-gray-100 dark:bg-gray-800', iconColor: 'text-gray-600 dark:text-gray-400' },
          { icon: BookOpen, label: 'Cours', value: stats.totalCourses.toString(), bg: 'bg-indigo-50 dark:bg-indigo-950/50', iconColor: 'text-indigo-600 dark:text-indigo-400' },
          { icon: ShoppingCart, label: 'Commandes', value: stats.totalOrders.toString(), bg: 'bg-cyan-50 dark:bg-cyan-950/50', iconColor: 'text-cyan-600 dark:text-cyan-400' },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${stat.bg}`}>
              <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="p-5">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Revenus mensuels</h2>
            {stats.monthlyRevenue.length === 0 ? (
              <p className="text-sm text-gray-500 py-12 text-center">Aucune commande payée pour le moment.</p>
            ) : (
              <>
                <div className="h-48 flex items-end gap-1.5">
                  {stats.monthlyRevenue.map((m) => (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full rounded-sm bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors" style={{ height: `${(m.revenue / maxRevenue) * 100}%` }} />
                      <span className="text-[10px] text-gray-400">{m.month}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-500">Total</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(stats.totalRevenue)}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Dernières commandes</h2>
              <Link href="/admin/orders" className="text-xs text-blue-600 hover:underline">Voir tout</Link>
            </div>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-gray-500 py-8 text-center">Aucune commande pour le moment.</p>
            ) : (
              <div className="overflow-x-auto -mx-5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th className="text-left py-2.5 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Client</th>
                      <th className="text-left py-2.5 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Montant</th>
                      <th className="text-left py-2.5 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => {
                      const cfg = statusConfig[order.status] || { variant: 'default' as const, label: order.status };
                      return (
                        <tr key={order.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                          <td className="py-2.5 px-5">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[140px]">{order.customerLabel}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[140px]">{order.itemsSummary}</p>
                          </td>
                          <td className="py-2.5 px-5 text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">{formatCurrency(order.amount)}</td>
                          <td className="py-2.5 px-5"><Badge variant={cfg.variant} size="sm">{cfg.label}</Badge></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Cours</h2>
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un cours..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Link href="/admin/courses">
                <Button variant="outline" size="sm">Gérer</Button>
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Titre</th>
                  <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Catégorie</th>
                  <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Étudiants</th>
                  <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Note</th>
                  <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Prix</th>
                  <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer" onClick={() => window.location.assign(`/admin/courses/${course.id}`)}>
                    <td className="py-3 px-5 font-medium text-gray-900 dark:text-white whitespace-nowrap">{course.title}</td>
                    <td className="py-3 px-5 text-gray-500 whitespace-nowrap">{course.category.name}</td>
                    <td className="py-3 px-5 text-gray-500 whitespace-nowrap">{course.totalStudents}</td>
                    <td className="py-3 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-gray-700 dark:text-gray-300">{course.rating}</span>
                      </div>
                    </td>
                    <td className="py-3 px-5 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                      {course.price === 0 ? 'Gratuit' : formatCurrency(course.price, course.currency)}
                    </td>
                    <td className="py-3 px-5">
                      <Badge variant={course.isPublished ? 'success' : 'warning'} size="sm">{course.isPublished ? 'Publié' : 'Brouillon'}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCourses.length === 0 && (
              <div className="text-center py-8 text-sm text-gray-500">Aucun cours trouvé pour &quot;{searchQuery}&quot;</div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
