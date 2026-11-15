import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { PaperPlaneIcon, TriangleIcon } from "@/components/ui/Icons";

interface PageBannerProps {
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** Full-bleed variant used on public pages; contained variant for dashboard cards. */
  variant?: "full" | "card";
  mascot?: string;
}

/**
 * Light-blue hero band (Figma UI-38): title + right-aligned subtitle on the start side, mascot resting on the bottom
 * edge on the end side with a single dashed trajectory ending in one paper plane. Ornaments: a clean radial glow with
 * a single circle at the top-right, solid circle + half-dot shapes at the bottom-left.
 * (`start` = right and `end` = left in this RTL layout.)
 */
export function PageBanner({ title, subtitle, children, className, variant = "card", mascot = "/images/mascot-laptop@2x.png" }: PageBannerProps) {
  return (
    <div className={cn("relative overflow-hidden bg-primary-subtle", variant === "card" ? "rounded-2xl" : "", className)}>
      <Image src="/images/banner-bg-wide.png" alt="" fill className="object-cover opacity-90" sizes="1280px" priority />
      {/* Top-right: radial glow + one circle. */}
      <span className="pointer-events-none absolute -start-16 -top-24 size-72 rounded-full bg-[radial-gradient(circle,rgba(0,81,189,0.14)_0%,transparent_70%)]" aria-hidden />
      <span className="pointer-events-none absolute start-24 top-5 size-5 rounded-full bg-primary-soft" aria-hidden />
      {/* Bottom-left: solid circle + half-dot halftone. */}
      <span className="pointer-events-none absolute -bottom-16 -end-16 size-56 rounded-full bg-white/60" aria-hidden />
      <span className="pointer-events-none absolute -bottom-4 end-24 size-10 rounded-full bg-primary-soft/70" aria-hidden />
      <span className="dots-pattern pointer-events-none absolute -bottom-2 end-2 size-32 opacity-40" aria-hidden />
      <div className="relative flex items-end justify-between gap-6 px-5 pt-8 md:px-8 lg:px-12">
        <div className="flex flex-col items-start gap-3 pb-8 text-start">
          <h1 className="section-title text-[26px] md:text-[32px]">{title}</h1>
          {subtitle && <p className="section-subtitle max-w-md text-start">{subtitle}</p>}
          {children}
        </div>
        <div className="relative hidden h-44 w-80 shrink-0 self-end md:block">
          <TriangleIcon size={12} className="absolute start-6 top-6 -rotate-90 text-primary" />
          <Image src="/images/decor-arrow-dashed.png" alt="" width={64} height={80} className="absolute start-1/2 top-2 w-16 rotate-[100deg] opacity-70" />
          <PaperPlaneIcon size={40} strokeWidth={1.4} className="absolute start-1/2 top-0 ms-16 text-primary" />
          <Image src={mascot} alt="" width={180} height={168} className="absolute bottom-0 end-0 h-44 w-auto object-contain object-bottom" />
        </div>
      </div>
    </div>
  );
}
