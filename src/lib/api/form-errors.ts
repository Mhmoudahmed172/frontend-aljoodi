import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import type { ValidationErrors } from '@/types/api/common'

/**
 * Maps 422 `errors` (`{ field: [msg] }`) onto react-hook-form fields.
 * Nested keys like `prices.0.amount` are passed through unchanged (RHF supports dotted paths).
 * Returns the number of fields that were set.
 */
export const applyServerErrors = <T extends FieldValues>(setError: UseFormSetError<T>, errors: ValidationErrors | undefined | null): number => {
  if (!errors) return 0
  let count = 0
  for (const [field, messages] of Object.entries(errors)) {
    const message = Array.isArray(messages) ? messages[0] : String(messages)
    setError(field as Path<T>, { type: 'server', message })
    count++
  }
  return count
}
