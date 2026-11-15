/**
 * Shared API types (plans/README.md section 4.1). Every feature defines its own
 * resource types in `src/features/<feature>/types.ts` and reuses these.
 */

/** Response envelope returned by every backend endpoint. */
export type ApiEnvelope<T> = {
  error: boolean
  message: string
  code?: string
  data: T
}

/** Validation errors as returned in `data.errors` on HTTP 422. */
export type ValidationErrors = Record<string, string[]>

export type PaginationMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

/** Shape of every list endpoint: `data: { items, meta }`. */
export type Paginated<T> = {
  items: T[]
  meta: PaginationMeta
}

/** Query string accepted by list endpoints. Extra keys are feature filters. */
export type ListParams = {
  page?: number
  per_page?: number
  q?: string
  sort?: string
  dir?: 'asc' | 'desc'
  [filter: string]: string | number | boolean | undefined | null
}

export type AttachmentType = 'image' | 'file' | 'video' | string

/** `AttachmentResource` from the backend. */
export type Attachment = {
  uuid: string
  url: string
  type: AttachmentType
  document_type: string
  file_meta: {
    name?: string
    size?: number
    mime?: string
    extension?: string
    [key: string]: unknown
  } | null
  created_at: string
}

/** Minimal user representation embedded in other resources. */
export type UserMini = {
  uuid: string
  name: string
  mobile?: string | null
  avatar_url?: string | null
}

/** Authenticated user as returned by `/api/auth/login` and `/api/auth/me`. */
export type AuthUser = UserMini & {
  roles: string[]
  permissions: string[]
}

export type LoginResponse = {
  access_token: string
  expires_at: string
  user: AuthUser
}

/** Option used for enum selects: `{ value, label }` (label already localised by the backend or a t-key). */
export type EnumOption<V extends string | number = string> = {
  value: V
  label: string
  variant?: string
}

/** Sort direction used by DataTable and list params. */
export type SortDir = 'asc' | 'desc'

/** ISO 8601 date string. */
export type IsoDate = string

/** Money is a decimal string with two digits (e.g. "120.00"), currency ILS. */
export type Money = string
