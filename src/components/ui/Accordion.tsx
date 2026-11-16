'use client'

import { useId, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDownIcon } from './Icons'

interface AccordionItemProps {
  title: ReactNode
  children?: ReactNode
  defaultOpen?: boolean
  className?: string
  headerClassName?: string
  meta?: ReactNode
}

/** Accordion row used for course units and FAQs. */
export function AccordionItem({ title, children, defaultOpen = false, className, headerClassName, meta }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  return (
    <div className={cn('overflow-hidden rounded-xl', className)}>
      <button
        type="button"
        aria-expanded={open}
        id={`${id}-heading`}
        aria-controls={`${id}-body`}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex w-full items-center justify-between gap-3 px-5 py-3.5 text-start text-base font-semibold text-text-heading',
          headerClassName,
        )}>
        <span className="flex items-center gap-3">{title}</span>
        <span className="flex items-center gap-3 text-text-muted">
          {open && meta}
          <span data-accordion-chevron>
            <ChevronDownIcon size={18} />
          </span>
        </span>
      </button>
      {children && (
        <div
          id={`${id}-body`}
          role="region"
          aria-labelledby={`${id}-heading`}
          aria-hidden={!open}
          inert={!open}
          data-open={open}
          className="aj-accordionPanel">
          <div className="aj-accordionClip">
            <div data-accordion-body className="bg-white px-5 pb-4">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
