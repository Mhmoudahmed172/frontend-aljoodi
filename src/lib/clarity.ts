/**
 * Microsoft Clarity session recordings, linked to the signed-in student so the dashboard can go back to that
 * student's sessions (filter "Custom user ID" = the account uuid, or the custom session id kept with a suspicion).
 *
 * Loaded only when `NEXT_PUBLIC_CLARITY_PROJECT_ID` is set. Only the account uuid is sent, never the name, mobile or
 * e-mail; the watermark (which shows them) is masked with `data-clarity-mask`. The lesson video lives in a
 * cross-origin iframe Clarity cannot record. Every call is a no-op until the script is configured, and never throws.
 */
const PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "";

const SESSION_KEY = "aljoodi:clarity-session";

type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] };

declare global {
  interface Window {
    clarity?: ClarityFn;
  }
}

/** Whether Clarity is configured for this build. */
export const clarityEnabled = (): boolean => PROJECT_ID !== "";

const call = (...args: unknown[]): void => {
  if (!clarityEnabled() || typeof window === "undefined") return;
  // Components may call before `ClarityTracker` mounted: the snippet queues the call until the tag loads.
  loadClarity();
  try {
    window.clarity?.(...args);
  } catch {
    // Recording is best effort: it must never break the page.
  }
};

/** Adds the Clarity tag once (the official snippet: calls made before it loads are queued). */
export function loadClarity(): void {
  if (!clarityEnabled() || typeof window === "undefined" || window.clarity) return;

  const queued: ClarityFn = (...args: unknown[]) => {
    (queued.q = queued.q ?? []).push(args);
  };
  window.clarity = queued;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${encodeURIComponent(PROJECT_ID)}`;
  document.head.appendChild(script);
}

/** Our own id for this tab's recording session (kept across reloads of the tab), sent to Clarity and with reports. */
export function claritySessionId(): string | null {
  if (!clarityEnabled()) return null;
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      window.sessionStorage.setItem(SESSION_KEY, id);
    }

    return id;
  } catch {
    return null;
  }
}

/** Links the recording to the signed-in student (the account uuid only). */
export function clarityIdentify(userUuid: string): void {
  call("identify", userUuid, claritySessionId() ?? undefined, undefined, userUuid);
}

/**
 * Marks the recording with a suspicion (tag + event) and asks Clarity to keep it whatever its sampling, so the admin
 * reviewing the case can watch what the student did right before it.
 */
export function clarityMarkSuspicion(kind: string, lessonUuid?: string | null): void {
  call("set", "suspicion", kind);
  if (lessonUuid) call("set", "lesson", lessonUuid);
  call("event", `suspicion_${kind}`);
  call("upgrade", `suspicion_${kind}`);
}

/** What a report sends so the dashboard can find the recording: the custom session id and the user it was tied to. */
export function clarityReference(userUuid?: string | null): Record<string, string> {
  const session = claritySessionId();

  return session ? { clarity_session: session, ...(userUuid ? { clarity_user: userUuid } : {}) } : {};
}
