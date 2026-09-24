import { supabaseAdmin } from '@/lib/supabase/admin';
import type { User } from '@/types';

interface ProfileRow {
  id: string;
  email: string;
  full_name: string;
  avatar: string | null;
  role: User['role'];
  phone: string | null;
  location: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

function mapUser(row: ProfileRow): User {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    avatar: row.avatar ?? undefined,
    role: row.role,
    phone: row.phone ?? undefined,
    location: row.location ?? undefined,
    bio: row.bio ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAllUsersForAdmin(): Promise<User[]> {
  const { data, error } = await supabaseAdmin.from('profiles').select('*').order('created_at', { ascending: false }).limit(500);
  if (error || !data) return [];
  return (data as ProfileRow[]).map(mapUser);
}
