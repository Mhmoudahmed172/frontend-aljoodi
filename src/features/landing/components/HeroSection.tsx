import Image from 'next/image'
import Link from 'next/link'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { LOCAL_PREVIEW } from '@/lib/preview/catalog'
import { publicStyles as styles } from '@/components/brand/publicStyles'

export function HeroSection() {
  return (
    <>
      <PublicHeader />
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>منصة الجودي · التوجيهي الفلسطيني</span>
              <h1 className={styles.heroTitle}>
                طموحك <em>للقمة.</em>
                <br />
                وإحنا معك بالطريق.
              </h1>
              <p className={styles.lead}>
                شرح ترجعله، أمثلة تتدرّب عليها، ومحتوى مرتب حسب وحدات المادة. تعرّف على مدرّسيك، استكشف الدروس، وجرّب الشرح المتاح قبل ما تختار
                اشتراكك.
              </p>
              <div className={styles.actions}>
                <Link href="/subjects" className={styles.actionLight}>
                  استكشف المواد{' '}
                  <span data-action-arrow aria-hidden="true">
                    ←
                  </span>
                </Link>
                <Link
                  href={LOCAL_PREVIEW ? '/subjects/demo-math?course=demo-course-math#course-content' : '/subjects'}
                  className={styles.actionOutline}>
                  جرّب الشرح
                </Link>
              </div>
            </div>
            <figure className={styles.heroEnsemble}>
              <div className={styles.heroCompositeFrame}>
                <Image
                  src="/images/hero-teachers-composite.png"
                  alt="صورة جماعية مقدّمة لمدرّسي الجودي الأربعة"
                  width={1448}
                  height={1086}
                  className={styles.heroComposite}
                  sizes="(min-width:1024px) 600px,(min-width:640px) 560px,90vw"
                  unoptimized
                  preload
                />
              </div>
            </figure>
          </div>
        </div>
      </section>
    </>
  )
}
