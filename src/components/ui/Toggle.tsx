"use client";

import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

/** iOS-style switch used in settings. */
export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn("relative h-5 w-9 shrink-0 rounded-full transition", checked ? "bg-primary" : "bg-border-strong")}
      dir="ltr"
    >
      <span className={cn("absolute top-0.5 size-4 rounded-full bg-white shadow transition", checked ? "left-[18px]" : "left-0.5")} />
    </button>
  );
}
