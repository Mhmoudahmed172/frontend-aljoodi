'use client'
import { useEffect } from 'react'

/** Physical keys (`event.code`, so an Arabic keyboard layout matches too) that open DevTools with Ctrl+Shift / Cmd+Option. */
const DEVTOOLS_KEYS = ['KeyI', 'KeyJ', 'KeyC', 'KeyK']

/** Whether the shortcut opens DevTools, the page source, or saves the page. */
const isBlocked = (event: KeyboardEvent) => {
  const mod = event.ctrlKey || event.metaKey
  if (event.code === 'F12') return true
  if (mod && (event.shiftKey || event.altKey) && DEVTOOLS_KEYS.includes(event.code)) return true
  if (mod && event.code === 'KeyU') return true

  return mod && event.code === 'KeyS'
}

/**
 * Swallows the keyboard shortcuts that open DevTools (F12, Ctrl+Shift+I/J/C/K, Cmd+Option+I/J/C), the page source
 * (Ctrl+U, Cmd+Option+U) and "save page" (Ctrl/Cmd+S) on the whole site. A deterrent only: the browser menu still
 * opens DevTools, which the lesson player detects on its own. Renders nothing — mounted once at the app root.
 */
export function DevToolsShortcutGuard() {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isBlocked(event)) return
      event.preventDefault()
      event.stopPropagation()
    }

    window.addEventListener('keydown', onKeyDown, { capture: true })

    return () => window.removeEventListener('keydown', onKeyDown, { capture: true })
  }, [])

  return null
}
