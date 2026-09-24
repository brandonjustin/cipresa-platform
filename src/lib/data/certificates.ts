import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface UserCertificate {
  id: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  certificateUrl: string | null;
  issuedAt: string;
}

interface CertificateRow {
  id: string;
  course_id: string;
  certificate_url: string | null;
  issued_at: string;
  course: { title: string; slug: string } | null;
}

export async function getUserCertificates(userId: string): Promise<UserCertificate[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('certificates')
    .select('id, course_id, certificate_url, issued_at, course:courses(title, slug)')
    .eq('user_id', userId)
    .order('issued_at', { ascending: false });
  if (error || !data) return [];

  return (data as unknown as CertificateRow[])
    .filter((row) => row.course !== null)
    .map((row) => ({
      id: row.id,
      courseId: row.course_id,
      courseTitle: row.course!.title,
      courseSlug: row.course!.slug,
      certificateUrl: row.certificate_url,
      issuedAt: row.issued_at,
    }));
}
