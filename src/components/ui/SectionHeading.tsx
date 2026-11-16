import { cn } from '@/lib/utils'
interface Props {
  badge?: string
  before?: string
  highlight?: string
  after?: string
  subtitle?: string
  align?: 'center' | 'start'
  className?: string
  size?: 'lg' | 'md'
  sparkle?: boolean
  highlightClassName?: string
}
export function SectionHeading({ badge, before, highlight, after, subtitle, className, size = 'lg' }: Props) {
  return (
    <div className={cn('flex flex-col items-start gap-3 text-start', className)}>
      {badge && <span className="text-sm font-semibold text-primary">{badge}</span>}
      <h2 className={cn('font-bold leading-relaxed text-text-heading', size === 'md' ? 'text-2xl' : 'text-3xl')}>
        {before} {highlight} {after}
      </h2>
      {subtitle && <p className="max-w-2xl text-base leading-8 text-text-muted">{subtitle}</p>}
    </div>
  )
}
