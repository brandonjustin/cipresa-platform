import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllCoursesForAdmin } from '@/lib/data/courses';
import { formatCurrency } from '@/lib/utils/format';

export default async function AdminCoursesPage() {
  const courses = await getAllCoursesForAdmin();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Gestion des cours</h1>
          <p className="text-sm text-gray-500">{courses.length} cours au total</p>
        </div>
        <Link href="/admin/courses/new">
          <Button size="sm"><Plus className="w-4 h-4" /> Nouveau cours</Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Titre</th>
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Instructeur</th>
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Leçons</th>
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Prix</th>
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Statut</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="py-3 px-5">
                  <Link href={`/admin/courses/${course.id}`} className="font-medium text-gray-900 dark:text-white hover:text-blue-600 transition-colors">
                    {course.title}
                  </Link>
                </td>
                <td className="py-3 px-5 text-gray-500 whitespace-nowrap">{course.instructor.fullName || '—'}</td>
                <td className="py-3 px-5 text-gray-500 whitespace-nowrap">{course.totalLessons}</td>
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
        {courses.length === 0 && <p className="text-center py-12 text-sm text-gray-500">Aucun cours pour le moment.</p>}
      </div>
    </>
  );
}
