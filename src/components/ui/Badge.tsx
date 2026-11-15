import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "soft" | "yellow" | "green" | "red" | "grey" | "white";

const tones: Record<Tone, string> = {
  primary: "bg-primary text-white",
  soft: "bg-badge-bg text-badge-text",
  yellow: "bg-accent-soft text-text-heading",
  green: "bg-success-soft text-success",
  red: "bg-danger-soft text-danger",
  grey: "bg-surface text-text-muted",
  white: "bg-white text-text border border-border",
};

export function Badge({ tone = "soft", className, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold", tones[tone], className)}
      {...props}
    />
  );
}

/** Subject chip (Figma: 77x24, radius 24, #99B9E5 fill, 12px medium #030000). */
export function Chip({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("inline-flex h-6 min-w-[77px] items-center justify-center rounded-3xl bg-primary-soft px-3 text-xs font-medium text-text-heading", className)}
      {...props}
    />
  );
}
