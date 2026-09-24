import { AdminDashboardView } from '@/components/admin/admin-dashboard-view';
import { getAdminStats, getRecentOrders } from '@/lib/data/admin-stats';
import { getAllCoursesForAdmin } from '@/lib/data/courses';

// Auth + admin-role gating for /admin/* is already enforced by middleware
// (src/lib/supabase/middleware.ts) before this ever renders — no need to
// repeat the getUser() + profile-role network round trip here.
export default async function AdminDashboard() {
  const [stats, recentOrders, courses] = await Promise.all([getAdminStats(), getRecentOrders(), getAllCoursesForAdmin()]);

  return <AdminDashboardView stats={stats} recentOrders={recentOrders} courses={courses} />;
}
