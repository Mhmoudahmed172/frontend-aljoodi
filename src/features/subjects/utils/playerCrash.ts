/**
 * A crashed tab runs no more code, so the crash is found on the next load instead: the player leaves a mark in
 * `sessionStorage` while it is open and removes it on every clean exit (closing the modal, leaving or reloading the
 * page). A mark still there when the tab loads again means the last page died with the player open. `sessionStorage`
 * belongs to the tab and survives its reload, and another tab with a player open never looks like a crash.
 */
const KEY = "aljoodi:player-open";

/** `aliveAt` is refreshed while the player stays open, so `aliveAt - openedAt` is about how long it ran before a crash. */
type PlayerMark = { lesson: string; page: string; openedAt: number; aliveAt: number };

/** Remembers that the lesson player (opened at `openedAt`) is still open in this tab; called again every few seconds. */
export function markPlayerOpen(lesson: string, openedAt: number): void {
  try {
    const mark: PlayerMark = { lesson, page: window.location.pathname, openedAt, aliveAt: Date.now() };
    window.sessionStorage.setItem(KEY, JSON.stringify(mark));
  } catch {
    // Storage blocked (private mode, site data off): crashes simply go unreported.
  }
}

/** Forgets the mark: the player left the page cleanly. */
export function clearPlayerOpen(): void {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    // Nothing to clear when storage is blocked.
  }
}

/** The mark the previous page of this tab left behind (it crashed with the player open), removed as it is read. */
export function takeCrashedPlayer(): { lesson: string; page: string | null; openSeconds: number | null } | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(KEY);
    const mark = JSON.parse(raw) as Partial<PlayerMark>;
    if (typeof mark.lesson !== "string") return null;
    const openSeconds =
      typeof mark.openedAt === "number" && typeof mark.aliveAt === "number" ? Math.max(0, Math.round((mark.aliveAt - mark.openedAt) / 1000)) : null;

    return { lesson: mark.lesson, page: typeof mark.page === "string" ? mark.page.slice(0, 255) : null, openSeconds };
  } catch {
    return null;
  }
}
