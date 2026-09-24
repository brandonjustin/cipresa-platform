import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllBlogPostsForAdmin } from '@/lib/data/blog';
import { formatDate } from '@/lib/utils/format';

export default async function AdminBlogPage() {
  const posts = await getAllBlogPostsForAdmin();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Blog</h1>
          <p className="text-sm text-gray-500">{posts.length} articles</p>
        </div>
        <Link href="/admin/blog/new">
          <Button size="sm"><Plus className="w-4 h-4" /> Nouvel article</Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Titre</th>
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Catégorie</th>
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Publié le</th>
              <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-gray-500">Statut</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="py-3 px-5">
                  <Link href={`/admin/blog/${post.id}`} className="font-medium text-gray-900 dark:text-white hover:text-blue-600 transition-colors">
                    {post.title}
                  </Link>
                </td>
                <td className="py-3 px-5 text-gray-500 whitespace-nowrap">{post.category || '—'}</td>
                <td className="py-3 px-5 text-gray-500 whitespace-nowrap">{formatDate(post.publishedAt, 'short')}</td>
                <td className="py-3 px-5">
                  <Badge variant={post.isPublished ? 'success' : 'warning'} size="sm">{post.isPublished ? 'Publié' : 'Brouillon'}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && <p className="text-center py-12 text-sm text-gray-500">Aucun article pour le moment.</p>}
      </div>
    </>
  );
}
