import Link from 'next/link';
import { Star, Users, BookOpen, Award, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/animations/motion-components';
import { instructors, courses } from '@/lib/utils/data';
import { BgImage } from '@/components/ui/bg-image';

export default function InstructorsPage() {
  return (
    <PageTransition>
      <div className="pt-20">
        <div className="bg-gradient-to-b from-cipresa-950 to-gray-950 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="success" className="mb-4">Formateurs</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Nos formateurs</h1>
            <p className="text-white/60 max-w-2xl mx-auto">Des experts passionnés pour vous former</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <StaggerContainer className="space-y-8">
            {instructors.map((instructor) => {
              const instructorCourses = courses.filter(c => c.instructor.id === instructor.id);
              return (
                <StaggerItem key={instructor.id}>
                  <Card>
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cipresa-400 to-cipresa-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                          {instructor.fullName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{instructor.fullName}</h2>
                          <p className="text-cipresa-600 dark:text-cipresa-400 font-medium text-sm mb-2">{instructor.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{instructor.bio}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {instructor.expertise.map((exp) => (
                              <Badge key={exp} variant="default">{exp}</Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {instructor.totalCourses} cours</span>
                            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {instructor.totalStudents} étudiants</span>
                            <StarRating rating={instructor.rating} size={14} showValue />
                          </div>
                        </div>
                      </div>

                      {instructorCourses.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Ses formations</h3>
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {instructorCourses.map((course) => (
                              <Link key={course.id} href={`/course/${course.slug}`}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                <BgImage src={course.thumbnail} className="w-12 h-10 rounded-lg flex-shrink-0" sizes="160px" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-cipresa-600 transition-colors">{course.title}</p>
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {course.rating}
                                    <span>&middot;</span>
                                    <Users className="w-3 h-3" /> {course.totalStudents}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </div>
    </PageTransition>
  );
}
