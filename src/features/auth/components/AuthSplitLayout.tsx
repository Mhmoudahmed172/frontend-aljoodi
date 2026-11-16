import Image from 'next/image'
import type { ReactNode } from 'react'
import { Logo } from '@/components/ui/Logo'
import { publicStyles as styles } from '@/components/brand/publicStyles'
interface Props {
  heading: ReactNode
  subtitle: string
  mascot: string
  title: string
  children: ReactNode
}
export function AuthSplitLayout({ heading, subtitle, title, children }: Props) {
  return (
    <div className={styles.auth}>
      <div className={styles.container + ' ' + styles.authGrid}>
        <div className={styles.authPanel}>
          <div className="flex justify-center">
            <Logo width={144} />
          </div>
          <h2 className={styles.authHeading}>{title}</h2>
          {children}
        </div>
        <div className={styles.authCopy}>
          <h1>{heading}</h1>
          <p>{subtitle}</p>
          <div className={styles.authPhoto}>
            <Image src="/images/demo/study-scene.png" alt="مشهد توضيحي للمراجعة الجماعية" fill sizes="420px" />
          </div>
          <p>كل خطوة بتفهمها، بتبني عليها. · صورة توضيحية</p>
        </div>
      </div>
    </div>
  )
}
