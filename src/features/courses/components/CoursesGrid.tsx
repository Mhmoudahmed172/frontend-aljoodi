import { cn } from '@/lib/utils'
import { CourseCard } from './CourseCard'
import type { CourseCard as CourseCardData } from '../types/course.types'

interface CoursesGridProps {
  courses: CourseCardData[]
  className?: string
  editorial?: boolean
}

/** Grid of public course cards (subject, teacher, price), each linking to its subject page. */
export function CoursesGrid({ courses, className, editorial = false }: CoursesGridProps) {
  return (
    <div className={cn('grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3', className)}>
      {courses.map((course) => (
        <CourseCard key={course.uuid} course={course} editorial={editorial} />
      ))}
    </div>
  )
}
