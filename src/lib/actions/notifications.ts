'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Notification } from '@/types';

interface NotificationRow {
  id: string;
  user_id: string;
  title: string;
  message: string | null;
  type: Notification['type'];
  is_read: boolean;
  link: string | null;
  created_at: string;
}

function mapNotification(row: NotificationRow): Notification {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    message: row.message ?? '',
    type: row.type,
    read: row.is_read,
    link: row.link ?? undefined,
    createdAt: row.created_at,
  };
}

async function requireUser() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Vous devez être connecté.');
  return user;
}

export async function getMyNotifications(limit = 20): Promise<Notification[]> {
  const user = await requireUser();
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data as NotificationRow[] ?? []).map(mapNotification);
}

export async function markNotificationRead(id: string) {
  const user = await requireUser();
  const supabase = createServerSupabaseClient();
  await supabase.from('notifications').update({ is_read: true }).eq('id', id).eq('user_id', user.id);
}

export async function markAllNotificationsRead() {
  const user = await requireUser();
  const supabase = createServerSupabaseClient();
  await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);
}
