import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  label?: string
  className?: string
  showValue?: boolean
}

/** Yellow progress bar with percentage on the start edge, label on the end edge. */
export function ProgressBar({ value, label, className, showValue = true }: ProgressBarProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-text-muted">{label}</span>
          {showValue && <span className="font-semibold text-accent-strong">{value}%</span>}
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface" dir="rtl">
        <div className="h-full rounded-full bg-accent" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
