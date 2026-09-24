'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface UpdateProfileInput {
  fullName: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatar?: string;
}

export async function updateMyProfile(input: UpdateProfileInput) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Vous devez être connecté.');

  if (!input.fullName.trim()) throw new Error('Le nom complet est requis.');

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: input.fullName.trim(),
      phone: input.phone?.trim() || null,
      location: input.location?.trim() || null,
      bio: input.bio?.trim() || null,
      avatar: input.avatar?.trim() || null,
    })
    .eq('id', user.id);
  if (error) throw new Error(error.message);

  revalidatePath('/dashboard/settings');
  revalidatePath('/dashboard');
}
