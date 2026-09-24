import { notFound } from 'next/navigation';
import { CourseForm } from '@/components/admin/course-form';
import { CurriculumManager } from '@/components/admin/curriculum-manager';
import { getCourseByIdForAdmin, getCourseCategories, getAllInstructors, getCourseCurriculum } from '@/lib/data/courses';
import { updateCourse } from '@/lib/actions/admin/courses';

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  const course = await getCourseByIdForAdmin(params.id);
  if (!course) notFound();

  const [categories, instructors, sections] = await Promise.all([
    getCourseCategories(),
    getAllInstructors(),
    getCourseCurriculum(course.id),
  ]);

  return (
    <>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{course.title}</h1>
      <p className="text-sm text-gray-500 mb-6">/course/{course.slug}</p>

      <div className="space-y-8">
        <CourseForm categories={categories} instructors={instructors} course={course} action={updateCourse.bind(null, course.id)} />
        <CurriculumManager courseId={course.id} sections={sections} />
      </div>
    </>
  );
}
