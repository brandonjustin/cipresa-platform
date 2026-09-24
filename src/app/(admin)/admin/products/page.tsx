import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllProductsForAdmin } from '@/lib/data/products';
import { formatCurrency } from '@/lib/utils/format';

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Gestion des produits</h1>
          <p className="text-sm text-gray-500">{products.length} produits au total</p>
        </div>
        <Link href="/admin/products/new">
          <Button size="sm"><Plus className="w-4 h-4" /> Nouveau produit</Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Nom</th>
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Catégorie</th>
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Stock</th>
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Prix</th>
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Statut</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="py-3 px-5">
                  <Link href={`/admin/products/${product.id}`} className="font-medium text-gray-900 dark:text-white hover:text-blue-600 transition-colors">
                    {product.name}
                  </Link>
                </td>
                <td className="py-3 px-5 text-gray-500 whitespace-nowrap">{product.category.name || '—'}</td>
                <td className="py-3 px-5 whitespace-nowrap">
                  <span className={product.stock === 0 ? 'text-red-500 font-medium' : 'text-gray-500'}>{product.stock} {product.unit}</span>
                </td>
                <td className="py-3 px-5 font-semibold text-gray-900 dark:text-white whitespace-nowrap">{formatCurrency(product.price, product.currency)}</td>
                <td className="py-3 px-5">
                  <Badge variant={product.isPublished ? 'success' : 'warning'} size="sm">{product.isPublished ? 'Publié' : 'Brouillon'}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="text-center py-12 text-sm text-gray-500">Aucun produit pour le moment.</p>}
      </div>
    </>
  );
}
