import { MarketingPageSkeleton } from '@/components/ui/page-loader';

// Page-shaped placeholder shown instantly (it is prefetched with the route)
// while a dynamic page's server data loads.
export default function Loading() {
  return <MarketingPageSkeleton />;
}
