'use client'
import Image from 'next/image'
import { RichText } from '@/components/ui/RichText'
import type { TeacherDetail } from '../types/teacher.types'
import { publicStyles as styles } from '@/components/brand/publicStyles'
export function TeacherAbout({ teacher, compact = false }: { teacher: TeacherDetail; compact?: boolean }) {
  const gallery = teacher.gallery.map((item) => item.url).filter(Boolean)
  return (
    <section className={gallery.length ? styles.bioGrid : styles.bio}>
      <div className={styles.bio}>
        {!compact && <h2>عن المعلّم وطريقته</h2>}
        {teacher.bio ? <RichText html={teacher.bio} /> : <p>السيرة الذاتية غير منشورة حالياً.</p>}
        {teacher.features.length > 0 && (
          <ul>
            {teacher.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        )}
      </div>
      {gallery.length > 0 && (
        <div className={styles.gallery}>
          {gallery.slice(0, 4).map((src, i) => (
            <figure key={src + '-' + i}>
              <div className={styles.portrait}>
                <Image src={src} alt="صورة منشورة في ملف المعلّم" fill sizes="(min-width:768px) 250px,45vw" />
              </div>
              <figcaption>من الصور المنشورة في الملف</figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  )
}
