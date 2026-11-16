'use client'
import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { enterElement } from '@/lib/motion'
interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
}
/** Content is visible in SSR and without JS; intersection animation is optional. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined')
      return
    let animation: Animation | null = null
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect()
          animation = enterElement(el, delay)
        }
      },
      { threshold: 0, rootMargin: '0px 0px -24px 0px' },
    )
    observer.observe(el)
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const stop = () => {
      if (media.matches) {
        observer.disconnect()
        animation?.cancel()
      }
    }
    if (media.addEventListener) media.addEventListener('change', stop)
    else media.addListener(stop)
    return () => {
      observer.disconnect()
      animation?.cancel()
      if (media.removeEventListener) media.removeEventListener('change', stop)
      else media.removeListener(stop)
    }
  }, [delay])
  return (
    <div ref={ref} className={cn('reveal', className)}>
      {children}
    </div>
  )
}
