'use client'
import { Avatar } from '@/components/ui/Avatar'
import { RichText } from '@/components/ui/RichText'
import { htmlToText } from '@/lib/utils/html'
import { useSubject } from '../hooks/useSubject'
import { pickCourse, subjectPageTeachers } from '../utils/teachers'
import { UnitsAccordion } from './UnitsAccordion'
import { publicStyles as styles } from '@/components/brand/publicStyles'
export function SubjectDescription({ slug, courseSlug }: { slug: string; courseSlug?: string | null }) {
  const { subject, loading } = useSubject(slug)
  if (loading || !subject) return null
  const course = pickCourse(subject, courseSlug)
  const teachers = subjectPageTeachers(subject, courseSlug)
  return (
    <section>
      <div className={styles.courseInfoGrid}>
        <div className={styles.bio}>
          <h2>عن المحتوى</h2>
          {course?.description ? <RichText html={course.description} /> : <p>تفاصيل المحتوى بتظهر حسب الوصف المنشور للدورة.</p>}
          {course && course.outcomes.length > 0 && (
            <>
              <h3>شو بتتعلّم في هذه الدورة؟</h3>
              <ul>
                {course.outcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
            </>
          )}
        </div>
        {teachers.length > 0 && (
          <aside>
            <h3>مدرّسو المادة</h3>
            {teachers.map((teacher) => (
              <div className={styles.instructor} key={teacher.uuid}>
                <Avatar src={teacher.photo_url} alt={teacher.name} size={88} />
                <div>
                  <h4>{teacher.name}</h4>
                  {teacher.title && <p>{teacher.title}</p>}
                  {teacher.bio && <p>{htmlToText(teacher.bio)}</p>}
                </div>
              </div>
            ))}
          </aside>
        )}
      </div>
      <div id="course-content" className={styles.curriculum}>
        <h3>الوحدات والدروس</h3>
        <UnitsAccordion slug={slug} course={course?.slug} collapsedOnly />
      </div>
    </section>
  )
}
