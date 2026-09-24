import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getVerifiedUserId } from '@/lib/supabase/server';
import { getProductBySlug } from '@/lib/data/products';
import { getApprovedReviews } from '@/lib/data/reviews';
import { isItemWishlisted } from '@/lib/data/wishlist';
import { ProductDetailView } from '@/components/marketplace/product-detail-view';
import { JsonLd } from '@/components/seo/json-ld';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.shortDescription || product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  // Middleware already verified the session for this route and forwarded the id.
  const userId = getVerifiedUserId();
  const user = userId ? { id: userId } : null;

  const [reviews, isWishlisted] = await Promise.all([
    getApprovedReviews(product.id, 'product'),
    user ? isItemWishlisted(user.id, 'product', product.id) : Promise.resolve(false),
  ]);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.shortDescription || product.description,
          image: product.images,
          ...(product.totalReviews > 0
            ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.totalReviews } }
            : {}),
          offers: {
            '@type': 'Offer',
            price: product.salePrice ?? product.price,
            priceCurrency: product.currency,
            availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          },
        }}
      />
      <ProductDetailView product={product} reviews={reviews} initialIsWishlisted={isWishlisted} />
    </>
  );
}
