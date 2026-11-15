"use client";

import { cn } from "@/lib/utils";

export interface TabItem {
  key: string;
  label: string;
}

interface PillTabsProps {
  items: TabItem[];
  value: string;
  onChange: (key: string) => void;
  className?: string;
}

/** Rounded pill filter tabs (الكل / قيد الدراسة / مكتملة). */
export function PillTabs({ items, value, onChange, className }: PillTabsProps) {
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-full bg-surface p-1", className)}>
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onChange(item.key)}
          className={cn(
            "rounded-full px-5 py-1.5 text-xs font-semibold transition",
            value === item.key ? "bg-primary text-white" : "text-text hover:text-primary",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
