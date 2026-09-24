'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/require-admin';
import { supabaseAdmin } from '@/lib/supabase/admin';

const VALID_ROLES = ['student', 'instructor', 'admin', 'superadmin'];

export async function updateUserRole(userId: string, role: string) {
  const actingUser = await requireAdmin();
  if (!VALID_ROLES.includes(role)) throw new Error('Rôle invalide.');
  if (userId === actingUser.id) throw new Error('Vous ne pouvez pas modifier votre propre rôle.');

  const { error } = await supabaseAdmin.from('profiles').update({ role }).eq('id', userId);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/users');
}
