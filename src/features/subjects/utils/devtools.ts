/** A `debugger` statement that takes longer than this was paused on by an open DevTools. */
export const DEVTOOLS_PAUSE_MS = 100;

/**
 * How long a `debugger` statement held the page, in ms. It costs nothing while DevTools are closed and pauses the page
 * while they are open (docked or in their own window). It is built with `Function` because the production minifier
 * drops literal `debugger` statements. Turning off breakpoints in DevTools gets around it: this is a deterrent, not a lock.
 */
export function debuggerPauseMs(): number {
  const start = performance.now();
  Function("debugger")();

  return performance.now() - start;
}

/**
 * What the page looked like when DevTools were detected, sent with the report so an admin can tell an open DevTools
 * (long pause, docked panel eating the window) from a page that merely froze (long pause, nothing else).
 */
export function devToolsDetails(pauseMs: number): Record<string, unknown> {
  return {
    pause_ms: Math.round(pauseMs),
    outer_inner_width: window.outerWidth - window.innerWidth,
    outer_inner_height: window.outerHeight - window.innerHeight,
    visibility: document.visibilityState,
    focused: document.hasFocus(),
    hardware_threads: navigator.hardwareConcurrency ?? null,
    device_memory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? null,
  };
}
