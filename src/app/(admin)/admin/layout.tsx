import { AdminShell } from '@/components/admin/admin-shell';

// Hoisted out of every admin page (they used to each wrap themselves in
// <AdminShell>) so the sidebar/header stay mounted across admin navigation
// instead of fully unmounting and remounting on every click.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
