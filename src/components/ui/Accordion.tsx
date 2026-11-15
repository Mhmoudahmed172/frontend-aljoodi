"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "./Icons";

interface AccordionItemProps {
  title: ReactNode;
  children?: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
  meta?: ReactNode;
}

/** Accordion row used for course units and FAQs. */
export function AccordionItem({ title, children, defaultOpen = false, className, headerClassName, meta }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn("overflow-hidden rounded-xl", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn("flex w-full items-center justify-between gap-3 px-5 py-3.5 text-start text-sm font-bold text-text-heading", headerClassName)}
      >
        <span className="flex items-center gap-3">{title}</span>
        <span className="flex items-center gap-3 text-text-muted">
          {open && meta}
          {open ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
        </span>
      </button>
      {open && children && <div className="bg-white px-5 pb-4">{children}</div>}
    </div>
  );
}
