import { cache } from 'react';
import { supabasePublic } from '@/lib/supabase/public';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { BlogPost } from '@/types';

interface BlogPostRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image: string | null;
  category: string | null;
  author: string | null;
  author_avatar: string | null;
  tags: string[];
  featured: boolean;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

function mapBlogPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? '',
    content: row.content ?? '',
    image: row.image ?? '',
    category: row.category ?? '',
    author: row.author ?? '',
    authorAvatar: row.author_avatar ?? undefined,
    tags: row.tags ?? [],
    publishedAt: row.published_at ?? row.created_at,
    readTime: `${Math.max(1, Math.round((row.content ?? '').split(/\s+/).length / 200))} min`,
    featured: row.featured,
    isPublished: row.is_published,
  };
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabasePublic
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });
  if (error || !data) return [];
  return (data as BlogPostRow[]).map(mapBlogPost);
}

// Cached per-request — see getCourseBySlug in courses.ts for why.
export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  const { data, error } = await supabasePublic
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  if (error || !data) return null;
  return mapBlogPost(data as BlogPostRow);
});

// ==================== Admin ====================

export async function getAllBlogPostsForAdmin(): Promise<BlogPost[]> {
  const { data, error } = await supabaseAdmin.from('blog_posts').select('*').order('created_at', { ascending: false });
  if (error || !data) return [];
  return (data as BlogPostRow[]).map(mapBlogPost);
}

export async function getBlogPostByIdForAdmin(id: string): Promise<BlogPost | null> {
  const { data, error } = await supabaseAdmin.from('blog_posts').select('*').eq('id', id).single();
  if (error || !data) return null;
  return mapBlogPost(data as BlogPostRow);
}
