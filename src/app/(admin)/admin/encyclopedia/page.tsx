import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllPlantsForAdmin } from '@/lib/data/plants';

export default async function AdminEncyclopediaPage() {
  const plants = await getAllPlantsForAdmin();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Encyclopédie des plantes</h1>
          <p className="text-sm text-gray-500">{plants.length} fiches</p>
        </div>
        <Link href="/admin/encyclopedia/new">
          <Button size="sm"><Plus className="w-4 h-4" /> Nouvelle fiche</Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Nom commun</th>
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Catégorie</th>
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Disponibilité</th>
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Statut</th>
            </tr>
          </thead>
          <tbody>
            {plants.map((plant) => (
              <tr key={plant.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="py-3 px-5">
                  <Link href={`/admin/encyclopedia/${plant.id}`} className="font-medium text-gray-900 dark:text-white hover:text-blue-600 transition-colors">
                    {plant.commonName}
                  </Link>
                  <p className="text-xs text-gray-500 italic">{plant.scientificName}</p>
                </td>
                <td className="py-3 px-5 text-gray-500 whitespace-nowrap">{plant.category.name || '—'}</td>
                <td className="py-3 px-5">
                  <Badge variant={plant.availability ? 'success' : 'default'} size="sm">{plant.availability ? 'Disponible' : 'Indisponible'}</Badge>
                </td>
                <td className="py-3 px-5">
                  <Badge variant={plant.isPublished ? 'success' : 'warning'} size="sm">{plant.isPublished ? 'Publié' : 'Brouillon'}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {plants.length === 0 && <p className="text-center py-12 text-sm text-gray-500">Aucune fiche pour le moment.</p>}
      </div>
    </>
  );
}
