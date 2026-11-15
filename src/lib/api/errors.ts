import type { ValidationErrors } from '@/types/api/common'

/** Thrown by the API client for every failed request (HTTP error, envelope error, or network failure). */
export class ApiError extends Error {
  status: number
  code: string
  errors: ValidationErrors
  /** Raw `data` of the error envelope (e.g. `{ locked_by }` on a 423 `QUIZ_LOCKED`), when the backend sent one. */
  data: unknown

  constructor(params: { status: number; code?: string | null; message: string; errors?: ValidationErrors | null; data?: unknown }) {
    super(params.message)
    this.name = 'ApiError'
    this.status = params.status
    this.code = params.code ?? (params.status === 0 ? 'NETWORK_ERROR' : 'ERROR')
    this.errors = params.errors ?? {}
    this.data = params.data ?? null
  }

  get isValidation() {
    return this.status === 422 || Object.keys(this.errors).length > 0
  }

  get isUnauthorized() {
    return this.status === 401
  }

  get isForbidden() {
    return this.status === 403
  }

  get isNotFound() {
    return this.status === 404
  }

  /** First message of a field, if any. */
  fieldError(field: string): string | undefined {
    return this.errors[field]?.[0]
  }
}

export const isApiError = (e: unknown): e is ApiError => e instanceof ApiError

/** Converts anything thrown into an ApiError with a readable message. */
export const toApiError = (e: unknown, fallbackMessage = 'حدث خطأ غير متوقع'): ApiError => {
  if (isApiError(e)) return e
  if (e instanceof Error) return new ApiError({ status: 0, message: e.message || fallbackMessage })
  return new ApiError({ status: 0, message: fallbackMessage })
}
