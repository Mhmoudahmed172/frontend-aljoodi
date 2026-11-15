import type { ReactNode } from "react";

/**
 * Lays the landing page out as full-screen sections: every direct child section fills at least one screen
 * with its content centred (taller sections simply grow). Scrolling is the browser's normal scrolling.
 */
export function SnapSections({ children }: { children: ReactNode }) {
  return <div className="[&>section]:flex [&>section]:min-h-svh [&>section]:flex-col [&>section]:justify-center">{children}</div>;
}
