'use client'
import { useEffect, useRef, type ReactNode } from 'react'
import { enterElement } from '@/lib/motion'

const targets =
  '.aj-sectionHead, .aj-teacherSpotlight, .aj-studyIntro, .aj-editorialGrid, .aj-teamStrip, .aj-teacherShowcase > a, .aj-courseCard, .aj-pageIntro > .aj-container, .aj-profileGrid, .aj-story, .aj-contactGrid, .aj-guideLayout, .aj-learningGrid, .aj-supportInner, [data-reveal], [data-summit-reveal]'

export function PublicMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = ref.current
    if (!root || !window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined')
      return
    const seen = new WeakSet<Element>()
    const running = new Set<Animation>()
    const animate = (el: HTMLElement, delay = 0) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      // Reveal the single landscape and its photographed golden trail; no duplicate drawn path.
      let animation: Animation | null = null
      if (el.hasAttribute('data-summit-reveal') && typeof el.animate === 'function') {
        try {
          animation = el.animate(
            [
              { opacity: 0.55, clipPath: 'inset(0 0 0 24%)' },
              { opacity: 1, clipPath: 'inset(0)' },
            ],
            { duration: 650, easing: 'cubic-bezier(.2,.65,.25,1)', fill: 'none' },
          )
        } catch {
          /* Keep the static scene visible. */
        }
      } else animation = enterElement(el, delay)
      if (animation) {
        running.add(animation)
        animation.onfinish = () => running.delete(animation)
      }
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target)
            animate(entry.target as HTMLElement)
          }
        })
      },
      { threshold: 0, rootMargin: '0px 0px -24px 0px' },
    )
    for (const selector of ['.aj-heroCopy > *', '.aj-heroCompositeFrame']) {
      root.querySelectorAll<HTMLElement>(selector).forEach((el, i) => {
        seen.add(el)
        animate(el, Math.min((selector === '.aj-heroCompositeFrame' ? 110 : 0) + i * 45, 165))
      })
    }
    const observe = () =>
      root.querySelectorAll<HTMLElement>(targets).forEach((el) => {
        if (!seen.has(el)) {
          seen.add(el)
          observer.observe(el)
        }
      })
    observe()
    let frame = 0
    const changes = new MutationObserver(() => {
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0
          observe()
        })
    })
    changes.observe(root, { childList: true, subtree: true })
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const stop = () => {
      if (media.matches) {
        observer.disconnect()
        running.forEach((a) => a.cancel())
        running.clear()
      }
    }
    if (media.addEventListener) media.addEventListener('change', stop)
    else media.addListener(stop)
    return () => {
      observer.disconnect()
      changes.disconnect()
      cancelAnimationFrame(frame)
      running.forEach((a) => a.cancel())
      if (media.removeEventListener) media.removeEventListener('change', stop)
      else media.removeListener(stop)
    }
  }, [])
  return (
    <div ref={ref} className="aj-public brand-reading flex min-h-screen flex-col">
      {children}
    </div>
  )
}
