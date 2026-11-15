import { format as dfFormat, formatDistanceToNow, isValid, parseISO } from 'date-fns'
import { ar as arLocale } from 'date-fns/locale'

/** "120.00" -> "₪ 120.00" (locale aware digits are intentionally NOT used; amounts stay ASCII). */
export const formatMoney = (amount: string | number | null | undefined, currency = 'ILS'): string => {
  if (amount === null || amount === undefined || amount === '') return '—'
  const value = typeof amount === 'number' ? amount : Number(amount)
  if (Number.isNaN(value)) return String(amount)
  const symbol = currency === 'ILS' ? '₪' : currency
  return `${symbol} ${value.toFixed(2)}`
}

/** Normalises any numeric input to a 2-decimal string ("12" -> "12.00"). */
export const toMoneyString = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined || value === '') return ''
  const n = typeof value === 'number' ? value : Number(String(value).replace(/[^\d.-]/g, ''))
  return Number.isNaN(n) ? '' : n.toFixed(2)
}

export const parseDate = (value: string | Date | null | undefined): Date | null => {
  if (!value) return null
  const d = value instanceof Date ? value : parseISO(value)
  return isValid(d) ? d : null
}

export const formatDate = (value: string | Date | null | undefined, pattern = 'yyyy-MM-dd'): string => {
  const d = parseDate(value)
  return d ? dfFormat(d, pattern, { locale: arLocale }) : '—'
}

export const formatDateTime = (value: string | Date | null | undefined): string => formatDate(value, 'yyyy-MM-dd HH:mm')

export const formatRelative = (value: string | Date | null | undefined): string => {
  const d = parseDate(value)
  return d ? formatDistanceToNow(d, { addSuffix: true, locale: arLocale }) : '—'
}

export const formatFileSize = (bytes: number | null | undefined): string => {
  if (!bytes || bytes <= 0) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let v = bytes
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i++
  }
  return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

export const initials = (name: string | null | undefined): string =>
  (name ?? '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0))
    .join('')
    .toUpperCase() || '?'
