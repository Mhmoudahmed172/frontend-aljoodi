'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CoursesGrid } from '@/features/courses/components/CoursesGrid'
import { useCourses } from '@/features/courses/hooks/useCourses'
import { publicStyles as styles } from '@/components/brand/publicStyles'

export function SubjectsSection() {
  const { courses, loading } = useCourses({ per_page: 12 })
  const [subject, setSubject] = useState('all')
  const subjects = Array.from(new Map(courses.map((course) => [course.subject.uuid, course.subject])).values())
  const visible = courses.filter((course) => subject === 'all' || course.subject.uuid === subject)
  return (
    <section className={`${styles.section} ${styles.white} aj-homeCourses`} aria-labelledby="home-courses-title">
      <div className={styles.container}>
        <div className="aj-homeCoursesHead" data-reveal>
          <div>
            <span className={styles.eyebrow}>اختار اللي بتحتاجه لدراستك</span>
            <h2 id="home-courses-title" className={styles.title}>
              مادتك، من أول درس للمراجعة.
            </h2>
          </div>
          <Link href="/subjects" className={styles.textLink}>
            كل الدورات ←
          </Link>
        </div>
        <div className="aj-homeCourseFilters" role="group" aria-label="تصفية الدورات المعروضة حسب المادة">
          <button type="button" aria-pressed={subject === 'all'} onClick={() => setSubject('all')}>
            كل المواد
          </button>
          {subjects.map((item) => (
            <button type="button" key={item.uuid} aria-pressed={subject === item.uuid} onClick={() => setSubject(item.uuid)}>
              {item.name}
            </button>
          ))}
        </div>
        {visible.length ? (
          <CoursesGrid courses={visible} editorial className="aj-homeCourseGrid" />
        ) : (
          <p className={styles.lead}>{loading ? 'جارٍ تحميل الدورات…' : 'لا توجد دورات معروضة لهذا الاختيار.'}</p>
        )}
      </div>
    </section>
  )
}
