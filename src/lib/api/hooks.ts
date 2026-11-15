'use client'
import { useMutation, useQuery, useQueryClient, type QueryKey, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query'
import type { FieldValues, UseFormSetError } from 'react-hook-form'
import { toast } from 'sonner'
import { api } from './client'
import { ApiError, toApiError } from './errors'
import { applyServerErrors } from './form-errors'
import type { RequestOptions } from './client'

type ApiLikeClient = { get: <T>(path: string, options?: RequestOptions) => Promise<T> }

// Hardcoded Arabic fallbacks (matches the same strings used elsewhere, e.g. client.ts's network-error
// message). `lib/i18n`'s `useT()` is a hook and can't be called from this plain function; these could
// route through `messages/*.json` in a later pass if a non-hook translation accessor is added.
const FALLBACK_MESSAGES = {
  network: 'تعذّر الاتصال بالخادم',
  server: 'حدث خطأ في الخادم',
  unknown: 'حدث خطأ غير متوقع',
  validation: 'يرجى مراجعة الحقول المطلوبة',
  saved: 'تم الحفظ بنجاح',
} as const

export type ApiQueryOptions<T> = Omit<UseQueryOptions<T, ApiError, T, QueryKey>, 'queryKey' | 'queryFn'>

/**
 * `useApiQuery<T>(['courses', 'list'], '/admin/v1/courses', { page: 1 })`
 * The params are appended to the key so every filter change is a distinct cache entry.
 */
export const useApiQuery = <T>(
  key: unknown[],
  path: string,
  params?: Record<string, unknown>,
  options?: ApiQueryOptions<T>,
  client: ApiLikeClient = api,
) => {
  const cleanParams = params ? Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')) : undefined
  return useQuery<T, ApiError>({
    queryKey: cleanParams ? [...key, cleanParams] : key,
    queryFn: ({ signal }) => client.get<T>(path, { params: cleanParams, signal }),
    ...options,
  })
}

/** Human readable message for any error (ApiError or otherwise). */
export const errorMessage = (e: unknown): string => {
  const err = toApiError(e)
  if (err.status === 0) return FALLBACK_MESSAGES.network
  if (err.status >= 500) return err.message || FALLBACK_MESSAGES.server
  return err.message || FALLBACK_MESSAGES.unknown
}

export type ApiMutationOptions<TInput, TOutput> = {
  /** Query keys (prefixes) to invalidate on success. */
  invalidate?: unknown[][]
  /** Toast shown on success. `false` disables it. */
  successMessage?: string | false
  /** Toast shown on error. `false` disables it (422 errors still map to the form). */
  errorMessage?: string | false
  /** react-hook-form `setError` to map 422 `errors` onto fields. */
  setError?: UseFormSetError<FieldValues>
  onSuccess?: (data: TOutput, input: TInput) => void
  onError?: (error: ApiError, input: TInput) => void
} & Pick<UseMutationOptions<TOutput, ApiError, TInput>, 'onSettled' | 'onMutate' | 'retry'>

/**
 * `useApiMutation((body: Input) => api.post<Output>('/admin/v1/courses/add', body), { invalidate: [['courses']], successMessage: t('...') })`
 * Shows toasts and maps validation errors to the form when `setError` is provided.
 */
export const useApiMutation = <TInput = void, TOutput = unknown>(
  mutationFn: (input: TInput) => Promise<TOutput>,
  options: ApiMutationOptions<TInput, TOutput> = {},
) => {
  const queryClient = useQueryClient()
  const { invalidate, successMessage, errorMessage: errMsg, setError, onSuccess, onError, ...rest } = options

  return useMutation<TOutput, ApiError, TInput>({
    mutationFn: async (input) => {
      try {
        return await mutationFn(input)
      } catch (e) {
        throw toApiError(e)
      }
    },
    onSuccess: async (data, input) => {
      if (invalidate?.length) {
        await Promise.all(invalidate.map((key) => queryClient.invalidateQueries({ queryKey: key })))
      }
      if (successMessage !== false) {
        toast.success(successMessage ?? FALLBACK_MESSAGES.saved)
      }
      onSuccess?.(data, input)
    },
    onError: (error, input) => {
      const applied = setError ? applyServerErrors(setError as UseFormSetError<FieldValues>, error.errors) : 0
      if (errMsg !== false) {
        const message = applied > 0 ? FALLBACK_MESSAGES.validation : errMsg ?? errorMessage(error)
        toast.error(message)
      }
      onError?.(error, input)
    },
    ...rest,
  })
}

/** Convenience: invalidate keys imperatively (e.g. after a DataTable action). */
export const useInvalidate = () => {
  const queryClient = useQueryClient()
  return (...keys: unknown[][]) => Promise.all(keys.map((key) => queryClient.invalidateQueries({ queryKey: key })))
}
