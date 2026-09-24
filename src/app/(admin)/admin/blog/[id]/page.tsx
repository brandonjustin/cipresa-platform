import { notFound } from 'next/navigation';
import { BlogForm } from '@/components/admin/blog-form';
import { getBlogPostByIdForAdmin } from '@/lib/data/blog';
import { updateBlogPost } from '@/lib/actions/admin/blog';

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await getBlogPostByIdForAdmin(params.id);
  if (!post) notFound();

  return (
    <>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-6">/blog/{post.slug}</p>
      <BlogForm post={post} action={updateBlogPost.bind(null, post.id)} />
    </>
  );
}
