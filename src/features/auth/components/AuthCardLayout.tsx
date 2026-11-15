import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CardFlowDecor } from "./AuthDecor";

interface AuthCardLayoutProps {
  children: ReactNode;
  showMascot?: boolean;
  className?: string;
}

/** Centered white card on the light-blue backdrop used by the password flows. Mascot sits top-LEFT of the card (Figma). */
export function AuthCardLayout({ children, showMascot = true, className }: AuthCardLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary-faint px-6 py-16">
      <CardFlowDecor />
      <div className={cn("relative w-full max-w-[660px] rounded-2xl bg-white px-8 py-10 shadow-card", className)}>
        {showMascot && (
          <Image src="/images/mascot-forgot.png" alt="" width={99} height={92} className="absolute -top-20 end-0 w-24" />
        )}
        {children}
      </div>
    </div>
  );
}
