import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import type { ApiEnvelope, ValidationErrors } from '@/types/api/common'
import { ApiError } from './errors'
import { triggerUnauthorized, triggerSuspended } from './token-store'

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000').replace(/\/+$/, '')

const envelopeToError = (status: number, body: Partial<ApiEnvelope<{ errors?: ValidationErrors }>> | undefined, fallback: string) =>
  new ApiError({
    status,
    code: body?.code,
    message: body?.message || fallback,
    errors: body?.data && typeof body.data === 'object' ? ((body.data as { errors?: ValidationErrors }).errors ?? null) : null,
    data: body?.data ?? null,
  })

/**
 * Builds an axios instance with the shared envelope-unwrapping/error-throwing interceptors.
 * Used for both the direct-to-Laravel instance (public/unauthenticated endpoints) and the
 * same-origin `/api/proxy` instance (authenticated endpoints, see `apiProxy` below) — the
 * browser never holds the Passport token itself (it lives in an httpOnly cookie), so neither
 * instance attaches an `Authorization` header client-side; the proxy route handler does that
 * server-side.
 *
 * @param baseURL
 *
 * @return AxiosInstance
 */
const createApiInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    headers: { Accept: 'application/json' },
    timeout: 60_000,
  })

  instance.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
      // let the browser set the multipart boundary
      delete config.headers['Content-Type']
    } else if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
    }

    return config
  })

  instance.interceptors.response.use(
    (response: AxiosResponse<ApiEnvelope<unknown>>) => {
      const body = response.data
      if (body && typeof body === 'object' && 'error' in body && body.error === true) {
        throw envelopeToError(response.status, body as ApiEnvelope<{ errors?: ValidationErrors }>, 'تعذّر تنفيذ الطلب')
      }

      return response
    },
    (error: AxiosError<ApiEnvelope<{ errors?: ValidationErrors }>>) => {
      if (error.response) {
        const status = error.response.status
        const apiError = envelopeToError(status, error.response.data, error.message)
        if (status === 401) triggerUnauthorized()
        // The account was banned or deactivated while signed in: drop the session and explain on the login page.
        if (status === 403 && apiError.code === 'ACCOUNT_INACTIVE') triggerSuspended()

        return Promise.reject(apiError)
      }

      return Promise.reject(new ApiError({ status: 0, code: 'NETWORK_ERROR', message: 'تعذّر الاتصال بالخادم' }))
    },
  )

  return instance
}

/** Direct-to-Laravel instance for public/unauthenticated endpoints (catalog, login, register, OTP, password reset). */
export const axiosInstance = createApiInstance(API_URL)

/** Same-origin proxy instance for authenticated endpoints (`/user/*`, `/auth/me`, `/auth/logout`) — see `src/app/api/proxy/[...path]/route.ts`. */
export const proxyAxiosInstance = createApiInstance('/api/proxy')

const unwrap = <T>(response: AxiosResponse<ApiEnvelope<T>>): T => response.data?.data as T

const toFormData = (body: Record<string, unknown>): FormData => {
  const fd = new FormData()
  const append = (key: string, value: unknown) => {
    if (value === undefined || value === null) return
    if (value instanceof File || value instanceof Blob) fd.append(key, value)
    else if (Array.isArray(value)) value.forEach((v) => append(`${key}[]`, v))
    else if (typeof value === 'boolean') fd.append(key, value ? '1' : '0')
    else if (typeof value === 'object') Object.entries(value as Record<string, unknown>).forEach(([k, v]) => append(`${key}[${k}]`, v))
    else fd.append(key, String(value))
  }
  Object.entries(body).forEach(([k, v]) => append(k, v))
  return fd
}

export type RequestOptions = Pick<AxiosRequestConfig, 'params' | 'signal' | 'headers' | 'onUploadProgress' | 'timeout'>

/**
 * Builds an `api`-shaped client bound to a given axios instance. Every method unwraps the
 * `{error,message,data}` envelope and returns `data`; failures throw `ApiError { status, code, message, errors }`.
 *
 * @param instance
 *
 * @return object
 */
const makeApi = (instance: AxiosInstance) => ({
  get: <T>(path: string, options?: RequestOptions) => instance.get<ApiEnvelope<T>>(path, options).then(unwrap<T>),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) => instance.post<ApiEnvelope<T>>(path, body, options).then(unwrap<T>),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) => instance.put<ApiEnvelope<T>>(path, body, options).then(unwrap<T>),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) => instance.patch<ApiEnvelope<T>>(path, body, options).then(unwrap<T>),
  delete: <T>(path: string, options?: RequestOptions) => instance.delete<ApiEnvelope<T>>(path, options).then(unwrap<T>),
  /** multipart/form-data POST. Pass a FormData or a plain object (Files, arrays and nested objects are handled). */
  postForm: <T>(path: string, body: FormData | Record<string, unknown>, options?: RequestOptions) =>
    instance.post<ApiEnvelope<T>>(path, body instanceof FormData ? body : toFormData(body), options).then(unwrap<T>),
  /** Returns the full envelope (message included) for the rare case a caller needs it. */
  raw: <T>(config: AxiosRequestConfig) => instance.request<ApiEnvelope<T>>(config).then((r) => r.data),
  toFormData,
})

/** API client for public/unauthenticated endpoints — talks straight to Laravel. */
export const api = makeApi(axiosInstance)

/** API client for authenticated endpoints — routed through `/api/proxy/*` (see `src/app/api/proxy/[...path]/route.ts`), which attaches the httpOnly-cookie-backed Passport token server-side. */
export const apiProxy = makeApi(proxyAxiosInstance)

export { ApiError, isApiError, toApiError } from './errors'
