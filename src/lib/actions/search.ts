'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface SearchResultItem {
  id: string;
  title: string;
  slug: string;
  image: string;
  meta: string;
}

export interface SearchResults {
  courses: SearchResultItem[];
  products: SearchResultItem[];
  plants: SearchResultItem[];
}

const EMPTY: SearchResults = { courses: [], products: [], plants: [] };

export async function searchCatalog(query: string): Promise<SearchResults> {
  const q = query.trim();
  if (q.length < 2) return EMPTY;

  const supabase = createServerSupabaseClient();
  const like = `%${q}%`;

  const [{ data: courseRows }, { data: productRows }, { data: plantRows }] = await Promise.all([
    supabase
      .from('courses')
      .select('id, title, slug, thumbnail, price')
      .eq('is_published', true)
      .ilike('title', like)
      .limit(6),
    supabase
      .from('products')
      .select('id, name, slug, images, price, stock')
      .eq('is_published', true)
      .ilike('name', like)
      .limit(6),
    supabase
      .from('plants')
      .select('id, common_name, scientific_name, slug, images')
      .eq('is_published', true)
      .or(`common_name.ilike.${like},scientific_name.ilike.${like}`)
      .limit(6),
  ]);

  return {
    courses: (courseRows ?? []).map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      image: c.thumbnail ?? '',
      meta: c.price === 0 ? 'Gratuit' : `${c.price} CFA`,
    })),
    products: (productRows ?? []).map((p) => ({
      id: p.id,
      title: p.name,
      slug: p.slug,
      image: p.images?.[0] ?? '',
      meta: `${p.price} CFA · ${p.stock} en stock`,
    })),
    plants: (plantRows ?? []).map((p) => ({
      id: p.id,
      title: p.common_name,
      slug: p.slug,
      image: p.images?.[0] ?? '',
      meta: p.scientific_name,
    })),
  };
}

export async function getTrendingCourses(): Promise<SearchResultItem[]> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('courses')
    .select('id, title, slug, thumbnail, price')
    .eq('is_published', true)
    .eq('popular', true)
    .limit(4);

  return (data ?? []).map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    image: c.thumbnail ?? '',
    meta: c.price === 0 ? 'Gratuit' : `${c.price} CFA`,
  }));
}
