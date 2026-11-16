import type { ReactNode } from 'react'
import { publicStyles as styles } from '@/components/brand/publicStyles'
interface Props {
  title: ReactNode
  subtitle?: ReactNode
  children?: ReactNode
  className?: string
  variant?: 'full' | 'card'
  mascot?: string
  tone?: 'light' | 'ink'
}
export function PageBanner({ title, subtitle, children, className, variant = 'card', tone = 'light' }: Props) {
  if (variant === 'card')
    return (
      <div className={'rounded-xl border border-border bg-white px-6 py-6 ' + (className ?? '')}>
        <h1 className="text-2xl font-bold leading-relaxed text-text-heading">{title}</h1>
        {subtitle && <p className="mt-3 text-base leading-8 text-text-muted">{subtitle}</p>}
        {children}
      </div>
    )
  return (
    <section className={styles.pageIntro + (tone === 'ink' ? ' ' + styles.pageIntroInk : '')}>
      <div className={styles.container}>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {children}
      </div>
    </section>
  )
}
