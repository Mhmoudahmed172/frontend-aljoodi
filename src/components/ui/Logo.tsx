import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  alt?: string
  white?: boolean
  width?: number
  href?: string
}

/** Supplied Aljoodi book-and-star logo, kept as the original transparent PNG. `white` renders the inverted variant for teal surfaces. */
export function Logo({ className, white, width = 144, href = '/', alt = 'منصة الجودي' }: LogoProps) {
  const img = (
    <Image
      src="/images/aljoodi-logo.png"
      alt={alt}
      width={width}
      height={Math.round((width * 2) / 3)}
      preload
      unoptimized
      className={cn(white && 'brightness-0 invert', className)}
    />
  )
  return href ? (
    <Link href={href} className="inline-flex shrink-0">
      {img}
    </Link>
  ) : (
    img
  )
}
