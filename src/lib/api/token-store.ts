/**
 * Tiny in-memory token store for the public site. Left in place for the future
 * student area: whatever signs a visitor in calls `setToken()`, and the axios
 * interceptor picks the token up from here.
 */
let token: string | null = null
let unauthorizedHandler: (() => void) | null = null
let handlingUnauthorized = false

export const setToken = (value: string | null | undefined) => {
  token = value ?? null
}

export const getToken = () => token

export const clearToken = () => {
  token = null
}

/** Registered by whoever owns the session; called by the API client on 401. */
export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  unauthorizedHandler = handler
}

let suspendedHandler: (() => void) | null = null

/** Registered by whoever owns the session; called by the API client on a 403 `ACCOUNT_INACTIVE` (banned / deactivated). */
export const setSuspendedHandler = (handler: (() => void) | null) => {
  suspendedHandler = handler
}

/** Runs the suspended handler through the same once-guard as the 401 handler. */
export const triggerSuspended = () => {
  if (handlingUnauthorized) return
  handlingUnauthorized = true
  try {
    suspendedHandler?.()
  } finally {
    setTimeout(() => {
      handlingUnauthorized = false
    }, 5000)
  }
}

/** Runs the 401 handler once (guards against sign-out loops). */
export const triggerUnauthorized = () => {
  if (handlingUnauthorized) return
  handlingUnauthorized = true
  try {
    unauthorizedHandler?.()
  } finally {
    // allow a new cycle after the redirect settles
    setTimeout(() => {
      handlingUnauthorized = false
    }, 5000)
  }
}
