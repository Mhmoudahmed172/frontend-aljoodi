import Image from 'next/image'
import Link from 'next/link'
import { publicStyles as styles } from '@/components/brand/publicStyles'
export function SummitBanner() {
  return (
    <section className="aj-summit" aria-labelledby="summit-title">
      <div className={`${styles.container} aj-summitInner`}>
        <div className="aj-summitScene" data-summit-reveal>
          <Image
            src="/images/landscapes/summit-petrol-landscape.png"
            alt="مشهد جبلي توضيحي بإضاءة بترولية ومسار ذهبي نحو القمة"
            fill
            loading="lazy"
            sizes="(min-width:1280px) 1240px,100vw"
          />
        </div>
        <div className="aj-summitCopy">
          <h2 id="summit-title">
            معك… <span>حتى القمة</span>
          </h2>
          <p>طموحك إله قيمة. اختار مادتك، وابدأ بدراسة إلها ترتيب.</p>
          <Link className={styles.actionLight} href="/subjects">
            استكشف المواد{' '}
            <span data-action-arrow aria-hidden="true">
              ←
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
