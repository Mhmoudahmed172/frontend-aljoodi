'use client'

import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  total: number
  onChange?: (page: number) => void
  className?: string
}

export function Pagination({ page, total, onChange, className }: PaginationProps) {
  const pages = Array.from({ length: total }, (_, i) => i + 1)
  const box =
    'flex size-9 items-center justify-center rounded-lg border border-border bg-white text-xs font-semibold text-text transition hover:border-primary hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-text'
  return (
    <div className={cn('flex items-center gap-2', className)} dir="ltr">
      <button type="button" className={box} disabled={page <= 1} onClick={() => onChange?.(Math.max(1, page - 1))} aria-label="الصفحة السابقة">
        {'<'}
      </button>
      {pages.map((p) => (
        <button key={p} type="button" onClick={() => onChange?.(p)} className={cn(box, p === page && 'border-primary bg-primary text-white')}>
          {p}
        </button>
      ))}
      <button
        type="button"
        className={box}
        disabled={page >= total}
        onClick={() => onChange?.(Math.min(total, page + 1))}
        aria-label="الصفحة التالية">
        {'>'}
      </button>
    </div>
  )
}
