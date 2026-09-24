'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { WishlistItemType } from '@/lib/data/wishlist';

async function requireUser() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Vous devez être connecté.');
  return user;
}

/** Toggles a course/product/plant in the caller's wishlist. Returns the new saved state. */
export async function toggleWishlistItem(itemType: WishlistItemType, itemId: string): Promise<boolean> {
  const user = await requireUser();
  const supabase = createServerSupabaseClient();

  const { data: existing } = await supabase
    .from('wishlist_items')
    .select('id')
    .eq('user_id', user.id)
    .eq('item_type', itemType)
    .eq('item_id', itemId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from('wishlist_items').delete().eq('id', existing.id);
    if (error) throw new Error(error.message);
    revalidatePath('/dashboard/wishlist');
    return false;
  }

  const { error } = await supabase
    .from('wishlist_items')
    .insert({ user_id: user.id, item_type: itemType, item_id: itemId });
  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/wishlist');
  return true;
}

export async function removeWishlistItem(id: string) {
  const user = await requireUser();
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from('wishlist_items').delete().eq('id', id).eq('user_id', user.id);
  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/wishlist');
}

export async function getCurrentUserWishlistedProductIds(): Promise<string[]> {
  const user = await requireUser();
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('wishlist_items')
    .select('item_id')
    .eq('user_id', user.id)
    .eq('item_type', 'product');

  return (data ?? []).map((row) => row.item_id as string);
}
