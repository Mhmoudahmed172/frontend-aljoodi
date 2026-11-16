import Image from 'next/image'
import Link from 'next/link'
import { portraits } from '../portraits'
import { publicStyles as styles } from '@/components/brand/publicStyles'

export function TeachersSection() {
  return (
    <section className={`${styles.section} aj-homeTeachers`} aria-labelledby="home-teachers-title">
      <div className={styles.container}>
        <div className="aj-homeTeachersHead" data-reveal>
          <div>
            <span className={styles.eyebrow}>من فريق الجودي التعليمي</span>
            <h2 id="home-teachers-title" className={styles.title}>
              الشرح إله وجوه بتعرفها.
            </h2>
            <p className={styles.lead}>تعرّف على مدرّسي الجودي، واستكشف المواد وطريقة عرض الدروس قبل ما تختار.</p>
          </div>
          <div className={styles.actions}>
            <Link href="/teachers" className={styles.actionLight}>
              تصفّح دليل المدرّسين{' '}
              <span data-action-arrow aria-hidden="true">
                ←
              </span>
            </Link>
            <Link href="/subjects" className={styles.actionOutline}>
              استكشف موادك
            </Link>
          </div>
        </div>
        <figure className="aj-homeFaculty" aria-label="صور المدرّسين الأربعة المقدّمة من الجودي" data-reveal>
          {portraits.map((src, index) => (
            <div key={src} className="aj-homeFacultyPortrait">
              <Image
                src={src}
                alt={`صورة مقدّمة من فريق الجودي التعليمي — ${index + 1}`}
                fill
                sizes="(min-width:1024px) 290px,(min-width:640px) 24vw,44vw"
              />
            </div>
          ))}
        </figure>
      </div>
    </section>
  )
}
