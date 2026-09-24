import { CourseForm } from '@/components/admin/course-form';
import { getCourseCategories, getAllInstructors } from '@/lib/data/courses';
import { createCourse } from '@/lib/actions/admin/courses';

export default async function NewCoursePage() {
  const [categories, instructors] = await Promise.all([getCourseCategories(), getAllInstructors()]);

  return (
    <>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Nouveau cours</h1>
      <CourseForm categories={categories} instructors={instructors} action={createCourse} />
    </>
  );
}
