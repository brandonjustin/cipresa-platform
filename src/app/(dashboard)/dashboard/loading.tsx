import { DashboardContentSkeleton } from '@/components/ui/page-loader';

// Nested under dashboard/layout.tsx, so DashboardShell (sidebar, header) stays
// mounted — only the content area shows this placeholder while data loads.
export default function Loading() {
  return <DashboardContentSkeleton />;
}
