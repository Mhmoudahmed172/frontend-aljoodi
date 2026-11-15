import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  before?: string;
  highlight?: string;
  after?: string;
  subtitle?: string;
  align?: "center" | "start";
  className?: string;
  size?: "lg" | "md";
  /** Decorative balloon anchored at the end of the title line. */
  sparkle?: boolean;
  /** Extra classes for the glowing keyword (e.g. `marker-cyan` for the #29B3BB variant). */
  highlightClassName?: string;
}

/**
 * Section title block (Figma design system):
 * badge #DAE5F4/#1A39E7 → title 32px/150% bold #030000 with the keyword in #0051BD over a yellow glow → subtitle 14px/150% #5B5B5B.
 */
export function SectionHeading({ badge, before, highlight, after, subtitle, align = "center", className, size = "lg", sparkle = true, highlightClassName }: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-3", align === "center" ? "items-center text-center" : "items-start text-start", className)}>
      {badge && <span className="section-badge">{badge}</span>}
      <h2 className={cn("section-title", size === "md" && "text-[24px] md:text-[28px]", size === "lg" && "text-[26px] md:text-[32px]")}>
        {before} {highlight && <span className={cn("marker", highlightClassName)}>{highlight}</span>} {after}
        {sparkle && <span className="title-sparkle" aria-hidden />}
      </h2>
      {subtitle && <p className={cn("section-subtitle max-w-xl", align === "center" && "text-center")}>{subtitle}</p>}
    </div>
  );
}
