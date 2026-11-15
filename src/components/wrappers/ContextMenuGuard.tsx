'use client'
import { useEffect } from 'react'

/**
 * Turns off the browser's right-click menu on the whole site (no "Save video as", "Inspect", "View source"
 * one click away). Text fields keep it so students can still paste. A deterrent only: it does not stop
 * DevTools opened from the browser menu. Renders nothing — mounted once at the app root.
 */
export function ContextMenuGuard() {
  useEffect(() => {
    const onContextMenu = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, [contenteditable="true"]')) return
      event.preventDefault()
    }

    document.addEventListener('contextmenu', onContextMenu)

    return () => document.removeEventListener('contextmenu', onContextMenu)
  }, [])

  return null
}
