'use client'
import Link from 'next/link'
import { CourseCover } from '@/components/brand/CourseCover'
import { formatPrices } from '@/features/courses/utils/prices'
import { subjectCourseHref } from '@/features/subjects/utils/teachers'
import type { TeacherDetail } from '../types/teacher.types'
import { publicStyles as styles } from '@/components/brand/publicStyles'
export function TeacherSubjects({ teacher }: { teacher: TeacherDetail }) {
  return (
    <section>
      <div className={styles.sectionHead}>
        <div>
          <span className={styles.eyebrow}>المحتوى المنشور</span>
          <h2 className={styles.title}>المواد المتاحة مع هذا المعلّم</h2>
        </div>
      </div>
      {teacher.courses.length === 0 ? (
        <p className={styles.lead}>ما في مواد منشورة ضمن هذا الملف حالياً. تقدر ترجع للكتالوج وتشوف الخيارات المتاحة.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teacher.courses.map((course) => {
            const slug = course.subject?.slug ?? teacher.subjects[0]?.slug
            const href = slug ? subjectCourseHref(slug, course.slug) : '/subjects'
            const { current } = formatPrices(course.prices)
            return (
              <article key={course.uuid} className={styles.courseCard}>
                <Link href={href}>
                  <CourseCover
                    subject={course.subject?.name ?? teacher.subjects[0]?.name ?? course.name}
                    title={course.name}
                    cover={course.cover_url}
                    teacherPhoto={teacher.photo_url}
                    teacherName={teacher.name}
                  />
                </Link>
                <div className={styles.courseCardBody}>
                  <h3 className={styles.courseName}>
                    <Link href={href}>{course.name}</Link>
                  </h3>
                  <div className={styles.courseFooter}>
                    {current && <span className={styles.price}>{current} ₪</span>}
                    <Link className={styles.textLink} href={href}>
                      تفاصيل المادة ←
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
