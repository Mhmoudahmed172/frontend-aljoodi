/** Query param carrying the page to return to after login / registration (e.g. `/login?redirect=/subjects/math`). */
export const REDIRECT_PARAM = "redirect";

/**
 * Returns `value` only when it is a same-origin relative path (`/something`), otherwise `null`. Rejects absolute URLs,
 * protocol-relative (`//host`) and backslash (`/\host`) forms so the param can't be used as an open redirect.
 */
export function safeRedirect(value: string | null | undefined): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return null;
  if ([...value].some((char) => char.charCodeAt(0) < 0x20)) return null;

  return value;
}

/** Appends `redirect=<target>` to `path` when `target` is a safe relative path; returns `path` unchanged otherwise. */
export function withRedirect(path: string, target: string | null | undefined): string {
  const safe = safeRedirect(target);
  if (!safe) return path;

  return `${path}${path.includes("?") ? "&" : "?"}${REDIRECT_PARAM}=${encodeURIComponent(safe)}`;
}
