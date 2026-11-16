import type { ReactNode } from 'react'
import { Logo } from '@/components/ui/Logo'
import { publicStyles as styles } from '@/components/brand/publicStyles'
interface Props {
  children: ReactNode
  showMascot?: boolean
  className?: string
}
export function AuthCardLayout({ children, className }: Props) {
  return (
    <div className={styles.auth + ' flex items-center justify-center'}>
      <div className={styles.authPanel + ' ' + (className ?? '')}>
        <div className="mb-6 flex justify-center">
          <Logo width={144} />
        </div>
        {children}
      </div>
    </div>
  )
}
