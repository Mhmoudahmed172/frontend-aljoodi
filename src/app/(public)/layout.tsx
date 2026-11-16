import type { ReactNode } from 'react'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { PublicMotion } from '@/components/brand/PublicMotion'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <PublicMotion>
      <div className="flex-1">{children}</div>
      <PublicFooter />
    </PublicMotion>
  )
}
