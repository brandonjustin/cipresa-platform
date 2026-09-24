import { getFeaturedCourses, getCourseCategoriesWithCounts } from '@/lib/data/courses';
import { getFeaturedProducts } from '@/lib/data/products';
import { HomeView } from '@/components/marketing/home-view';

export const revalidate = 300;

export default async function HomePage() {
  const [courses, products, categories] = await Promise.all([
    getFeaturedCourses(4),
    getFeaturedProducts(4),
    getCourseCategoriesWithCounts(),
  ]);

  return (
    <HomeView
      courses={courses}
      products={products}
      categories={categories}
      initialWishlistedProductIds={[]}
    />
  );
}
