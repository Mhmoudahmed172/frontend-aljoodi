'use client'
import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'
import { useT } from '@/lib/i18n'
import { CourseCover } from '@/components/brand/CourseCover'
import { subjectCourseHref } from '@/features/subjects/utils/teachers'
import { formatPrices } from '../utils/prices'
import type { CourseCard as CourseData } from '../types/course.types'
import { publicStyles as styles } from '@/components/brand/publicStyles'
const BRANCHES: Record<string, string> = { scientific: 'علمي', literary: 'أدبي', sharia: 'شرعي' }
export function CourseCard({ course, editorial = false }: { course: CourseData; editorial?: boolean }) {
  const { t } = useT()
  const { current, original } = formatPrices(course.prices)
  const teachers = course.teachers ?? (course.teacher ? [course.teacher] : [])
  const href = subjectCourseHref(course.subject.slug, course.slug)
  return (
    <article className={styles.courseCard}>
      <Link href={href} aria-label={course.name}>
        <CourseCover
          subject={course.subject.name}
          title={course.name}
          cover={course.cover_url}
          teacherPhoto={editorial ? undefined : teachers[0]?.photo_url}
          teacherName={teachers[0]?.name}
          minimal={editorial}
        />
      </Link>
      <div className={styles.courseCardBody}>
        <div className={styles.courseKicker}>
          {!editorial && <span>التوجيهي الفلسطيني</span>}
          {course.branches.map((branch) => (
            <span key={branch}>{BRANCHES[branch] ?? branch}</span>
          ))}
        </div>
        <h3 className={styles.courseName}>
          <Link href={href}>{course.name}</Link>
        </h3>
        {teachers.length > 0 && (
          <div className={styles.courseTeacher}>
            {!editorial && <Avatar src={teachers[0].photo_url} alt={teachers[0].name} size={42} />}
            <span>
              {teachers
                .map((teacher) => teacher.name)
                .filter(Boolean)
                .join(' · ')}
            </span>
          </div>
        )}
        {editorial && (
          <p className="aj-homeCourseScope">
            {course.prices.both !== null
              ? 'باقة الفصلين الأول والثاني'
              : course.prices.first !== null
                ? 'الفصل الأول'
                : course.prices.second !== null
                  ? 'الفصل الثاني'
                  : 'تفاصيل المحتوى داخل الدورة'}
          </p>
        )}
        <div className={styles.courseFooter}>
          <div>
            {original && (
              <span className={styles.oldPrice}>
                {original} {t('common.currency')}
              </span>
            )}
            {current && (
              <span className={styles.price}>
                {current} {t('common.currency')}
              </span>
            )}
          </div>
          <Link className={styles.textLink} href={href}>
            تفاصيل المادة{' '}
            <span data-action-arrow aria-hidden="true">
              ←
            </span>
          </Link>
        </div>
      </div>
    </article>
  )
}
