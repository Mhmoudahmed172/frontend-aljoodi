import Image from 'next/image'
import { cn } from '@/lib/utils'

interface AvatarProps {
  /** Image URL; when missing the first letter of `alt` is rendered as an initials fallback. */
  src?: string | null
  alt: string
  size?: number
  className?: string
}

export function Avatar({ src, alt, size = 40, className }: AvatarProps) {
  const initial = alt.trim().charAt(0).toUpperCase()

  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-subtle font-bold text-primary',
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}>
      {src ? <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover object-top" /> : <span aria-hidden>{initial}</span>}
    </span>
  )
}
