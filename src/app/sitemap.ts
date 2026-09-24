import type { MetadataRoute } from 'next';
import { getPublishedCourses } from '@/lib/data/courses';
import { getPublishedProducts } from '@/lib/data/products';
import { getPublishedPlants } from '@/lib/data/plants';
import { getPublishedBlogPosts } from '@/lib/data/blog';
import { getPublishedLearningPaths } from '@/lib/data/learning-paths';

const STATIC_ROUTES = [
  '', 'about', 'services', 'contact', 'courses', 'marketplace', 'encyclopedia',
  'blog', 'paths', 'events', 'faq', 'instructors', 'careers',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const [courses, products, plants, posts, paths] = await Promise.all([
    getPublishedCourses(),
    getPublishedProducts(),
    getPublishedPlants(),
    getPublishedBlogPosts(),
    getPublishedLearningPaths(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.7,
  }));

  const dynamicEntries: MetadataRoute.Sitemap = [
    ...courses.map((c) => ({ url: `${siteUrl}/course/${c.slug}`, lastModified: new Date(c.updatedAt), changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...products.map((p) => ({ url: `${siteUrl}/product/${p.slug}`, lastModified: new Date(p.createdAt), changeFrequency: 'weekly' as const, priority: 0.6 })),
    ...plants.map((p) => ({ url: `${siteUrl}/plant/${p.slug}`, lastModified: new Date(p.createdAt), changeFrequency: 'monthly' as const, priority: 0.5 })),
    ...posts.map((p) => ({ url: `${siteUrl}/blog/${p.slug}`, lastModified: new Date(p.publishedAt), changeFrequency: 'monthly' as const, priority: 0.5 })),
    ...paths.map((p) => ({ url: `${siteUrl}/paths/${p.slug}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 })),
  ];

  return [...staticEntries, ...dynamicEntries];
}
