'use client'
import Link from 'next/link'
import { CourseCover } from '@/components/brand/CourseCover'
import type { Subject } from '../types/subject.types'
import { publicStyles as styles } from '@/components/brand/publicStyles'
export function SubjectCard({ subject, highlighted }: { subject: Subject; highlighted?: boolean }) {
  const href = '/subjects/' + subject.slug
  return (
    <article className={styles.courseCard} style={highlighted ? { borderColor: 'var(--color-teal)' } : undefined}>
      <Link href={href}>
        <CourseCover subject={subject.name} />
      </Link>
      <div className={styles.courseCardBody}>
        <h3 className={styles.courseName}>
          <Link href={href}>{subject.name}</Link>
        </h3>
        <div className={styles.courseFooter}>
          <span className={styles.teacherStatus}>{subject.teachers_count} مدرّسين في الكتالوج</span>
          <Link href={href} className={styles.textLink}>
            استكشف المادة ←
          </Link>
        </div>
      </div>
    </article>
  )
}
