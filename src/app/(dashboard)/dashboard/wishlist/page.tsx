import { redirect } from 'next/navigation';
import { getVerifiedUserId } from '@/lib/supabase/server';
import { getUserWishlistWithDetails } from '@/lib/data/wishlist';
import { WishlistView } from '@/components/dashboard/wishlist-view';

export default async function WishlistPage() {
  // Middleware already verified the session for this route and forwarded the id.
  const userId = getVerifiedUserId();
  const user = userId ? { id: userId } : null;
  if (!user) redirect('/auth/login?next=/dashboard/wishlist');

  const items = await getUserWishlistWithDetails(user.id);

  return <WishlistView items={items} />;
}
