/** Progressive enhancement only: no hidden initial state or animation-dependent layout. */
export function enterElement(element: HTMLElement, delay = 0): Animation | null {
  if (typeof element.animate !== 'function' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  try {
    return element.animate(
      [
        { opacity: 0.35, transform: 'translateY(20px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      {
        duration: 540,
        delay: Math.min(180, Math.max(0, delay)),
        easing: 'cubic-bezier(.2,.65,.25,1)',
        fill: 'none',
      },
    )
  } catch {
    return null
  }
}
