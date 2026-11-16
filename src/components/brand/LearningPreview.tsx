'use client'

import Link from 'next/link'
import { useCourses } from '@/features/courses/hooks/useCourses'
import { UnitsAccordion } from '@/features/subjects/components/UnitsAccordion'
import { subjectCourseHref } from '@/features/subjects/utils/teachers'
import { publicStyles as styles } from '@/components/brand/publicStyles'

/** The actual public curriculum component, not a fabricated screenshot or private student screen. */
export function LearningPreview() {
  const { courses, loading } = useCourses({ per_page: 3 })
  const course = courses[0]
  return (
    <div>
      <div className={styles.platform}>
        <div className={styles.platformBar}>
          <span>الجودي / مساحة التعلّم</span>
          <span>المادة ← الوحدات ← الدروس</span>
        </div>
        <div className={styles.platformBody}>
          <span className={styles.eyebrow}>من واجهة محتوى المادة</span>
          {course ? (
            <>
              <h3>{course.name}</h3>
              <UnitsAccordion slug={course.subject.slug} course={course.slug} collapsedOnly />
              <Link className={styles.textLink} href={subjectCourseHref(course.subject.slug, course.slug)}>
                استكشف الدورة وابدأ{' '}
                <span data-action-arrow aria-hidden="true">
                  ←
                </span>
              </Link>
            </>
          ) : (
            <p className={styles.lead}>{loading ? 'جارٍ تحميل محتوى المادة…' : 'استكشف الكتالوج للاطّلاع على الوحدات والدروس المنشورة.'}</p>
          )}
        </div>
      </div>
      <p className={styles.platformCaption}>
        هذه واجهة محتوى المادة نفسها: وحدات ودروس مرتبة، ومعاينات حسب المحتوى المنشور. افتح الدرس المتاح وجرّب المثال التفاعلي.
      </p>
    </div>
  )
}
