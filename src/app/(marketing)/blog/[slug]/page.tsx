import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getPublishedBlogPosts } from '@/lib/data/blog';
import { BlogDetailView } from '@/components/blog/blog-detail-view';
import { JsonLd } from '@/components/seo/json-ld';

// No per-request/personalized data (see src/lib/data/blog.ts) — static + ISR
// instead of a live round trip on every navigation.
export const revalidate = 300;

// Without this, a dynamic-segment route like [slug] renders on demand for
// every request regardless of revalidate — this is what actually makes each
// post pre-rendered at build time (then kept fresh via revalidate above).
export async function generateStaticParams() {
  const posts = await getPublishedBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      images: post.image ? [{ url: post.image }] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const allPosts = await getPublishedBlogPosts();
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && (p.category === post.category || p.tags.some((t) => post.tags.includes(t))))
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.excerpt,
          image: post.image ? [post.image] : undefined,
          datePublished: post.publishedAt,
          author: { '@type': 'Person', name: post.author },
        }}
      />
      <BlogDetailView post={post} relatedPosts={relatedPosts} />
    </>
  );
}
