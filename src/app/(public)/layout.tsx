import type { ReactNode } from "react";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex-1">{children}</div>
      <PublicFooter />
    </div>
  );
}
