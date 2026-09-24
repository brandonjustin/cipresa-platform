import { unstable_cache } from 'next/cache';
import { supabasePublic } from '@/lib/supabase/public';
import type { Review } from '@/types';

interface ReviewRow {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  target_id: string;
  target_type: Review['targetType'];
  rating: number;
  comment: string | null;
  created_at: string;
}

function mapReview(row: ReviewRow): Review {
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    userAvatar: row.user_avatar ?? undefined,
    targetId: row.target_id,
    targetType: row.target_type,
    rating: row.rating,
    comment: row.comment ?? '',
    createdAt: row.created_at,
  };
}

/** Approved reviews are public: cached across visitors (5 min), cookie-free client. */
export const getApprovedReviews = unstable_cache(
  async (targetId: string, targetType: 'course' | 'product'): Promise<Review[]> => {
  const { data, error } = await supabasePublic
    .from('reviews')
    .select('*')
    .eq('target_id', targetId)
    .eq('target_type', targetType)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return (data as ReviewRow[]).map(mapReview);
  },
  ['approved-reviews'],
  { revalidate: 300, tags: ['reviews'] }
);
