import type { Metadata } from 'next';
import { getPublishedProducts, getProductCategories } from '@/lib/data/products';
import { MarketplaceBrowser } from '@/components/marketplace/marketplace-browser';

export const metadata: Metadata = {
  title: 'Boutique agricole',
  description: 'Semences, plants, intrants et équipements agricoles pour une agriculture productive au Cameroun.',
};

// No per-request data (see src/lib/data/products.ts) — static + ISR instead
// of a live round trip on every navigation.
export const revalidate = 300;

export default async function MarketplacePage() {
  const [products, categories] = await Promise.all([getPublishedProducts(), getProductCategories()]);
  return <MarketplaceBrowser products={products} categories={categories} />;
}
