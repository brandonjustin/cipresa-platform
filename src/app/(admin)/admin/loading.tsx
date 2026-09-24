import { DashboardContentSkeleton } from '@/components/ui/page-loader';

// Nested under admin/layout.tsx, so AdminShell (sidebar) stays mounted —
// only the content area shows this placeholder while data loads.
export default function Loading() {
  return <DashboardContentSkeleton />;
}
