import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getCoursesByIds } from '@/lib/data/courses';
import { getProductsByIds } from '@/lib/data/products';
import { getPlantsByIds } from '@/lib/data/plants';
import type { Course, Product, Plant } from '@/types';

export type WishlistItemType = 'course' | 'product' | 'plant';

export interface WishlistEntry {
  id: string;
  itemType: WishlistItemType;
  itemId: string;
  addedAt: string;
}

export async function getUserWishlistItemIds(userId: string): Promise<WishlistEntry[]> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('wishlist_items')
    .select('id, item_type, item_id, added_at')
    .eq('user_id', userId)
    .order('added_at', { ascending: false });

  return (data ?? []).map((row) => ({
    id: row.id as string,
    itemType: row.item_type as WishlistItemType,
    itemId: row.item_id as string,
    addedAt: row.added_at as string,
  }));
}

export async function isItemWishlisted(
  userId: string,
  itemType: WishlistItemType,
  itemId: string
): Promise<boolean> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('wishlist_items')
    .select('id')
    .eq('user_id', userId)
    .eq('item_type', itemType)
    .eq('item_id', itemId)
    .maybeSingle();
  return !!data;
}

export interface WishlistCourseRow extends WishlistEntry {
  itemType: 'course';
  course: Course;
}
export interface WishlistProductRow extends WishlistEntry {
  itemType: 'product';
  product: Product;
}
export interface WishlistPlantRow extends WishlistEntry {
  itemType: 'plant';
  plant: Plant;
}
export type WishlistDetailRow = WishlistCourseRow | WishlistProductRow | WishlistPlantRow;

/** Wishlist entries enriched with the underlying course/product/plant, newest first.
 * Entries whose target has since been unpublished or deleted are silently dropped. */
export async function getUserWishlistWithDetails(userId: string): Promise<WishlistDetailRow[]> {
  const entries = await getUserWishlistItemIds(userId);
  if (entries.length === 0) return [];

  const courseIds = entries.filter((e) => e.itemType === 'course').map((e) => e.itemId);
  const productIds = entries.filter((e) => e.itemType === 'product').map((e) => e.itemId);
  const plantIds = entries.filter((e) => e.itemType === 'plant').map((e) => e.itemId);

  const [courses, products, plants] = await Promise.all([
    getCoursesByIds(courseIds),
    getProductsByIds(productIds),
    getPlantsByIds(plantIds),
  ]);

  const courseById = new Map(courses.map((c) => [c.id, c]));
  const productById = new Map(products.map((p) => [p.id, p]));
  const plantById = new Map(plants.map((p) => [p.id, p]));

  const rows: WishlistDetailRow[] = [];
  for (const entry of entries) {
    if (entry.itemType === 'course') {
      const course = courseById.get(entry.itemId);
      if (course) rows.push({ ...entry, itemType: 'course', course });
    } else if (entry.itemType === 'product') {
      const product = productById.get(entry.itemId);
      if (product) rows.push({ ...entry, itemType: 'product', product });
    } else {
      const plant = plantById.get(entry.itemId);
      if (plant) rows.push({ ...entry, itemType: 'plant', plant });
    }
  }
  return rows;
}
