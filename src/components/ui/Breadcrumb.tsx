import Link from 'next/link'
import { Fragment } from 'react'

export interface Crumb {
  label: string
  href?: string
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1.5 py-4 text-sm text-text-muted" aria-label="مسار الصفحة">
      {items.map((item, i) => {
        const last = i === items.length - 1
        return (
          <Fragment key={item.label + i}>
            {item.href && !last ? (
              <Link href={item.href} className="hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className={last ? 'font-bold text-primary' : undefined}>{item.label}</span>
            )}
            {!last && <span>/</span>}
          </Fragment>
        )
      })}
    </nav>
  )
}
