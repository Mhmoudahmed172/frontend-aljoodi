'use client'

import { forwardRef, useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { EyeIcon, EyeOffIcon } from './Icons'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  startIcon?: ReactNode
  endIcon?: ReactNode
  error?: string
  wrapperClassName?: string
}

/** Rounded pill input matching the Figma form fields. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, startIcon, endIcon, error, className, wrapperClassName, id, ...props },
  ref,
) {
  return (
    <div className={cn('flex flex-col gap-2', wrapperClassName)}>
      {label && (
        <label htmlFor={id} className="text-sm font-bold text-text-heading">
          {label}
        </label>
      )}
      <div className="relative">
        {startIcon && <span className="pointer-events-none absolute inset-y-0 start-4 flex items-center text-text-soft">{startIcon}</span>}
        <input
          ref={ref}
          id={id}
          data-ui-field
          className={cn(
            'h-12 w-full rounded-lg border border-border bg-white px-5 text-base text-text outline-none transition placeholder:text-text-placeholder focus:border-primary',
            startIcon && 'ps-11',
            endIcon && 'pe-11',
            error && 'border-danger',
            className,
          )}
          {...props}
        />
        {endIcon && <span className="absolute inset-y-0 end-4 flex items-center text-text-muted">{endIcon}</span>}
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
})

/** Password input with show / hide toggle on the start edge (as in the design). */
export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(function PasswordInput(props, ref) {
  const [visible, setVisible] = useState(false)
  return (
    <Input
      ref={ref}
      type={visible ? 'text' : 'password'}
      endIcon={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="text-text-muted"
          aria-label={visible ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}>
          {visible ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
        </button>
      }
      {...props}
    />
  )
})

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ label, className, id, ...props }, ref) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-sm font-bold text-text-heading">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        data-ui-field
        className={cn(
          'min-h-28 w-full rounded-2xl border border-border bg-white px-5 py-3 text-sm text-text outline-none transition placeholder:text-text-placeholder focus:border-primary',
          className,
        )}
        {...props}
      />
    </div>
  )
})
