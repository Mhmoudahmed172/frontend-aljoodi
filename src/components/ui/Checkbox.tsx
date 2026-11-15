import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  /** Fill colour of the checked state: primary blue (default) or green #22C55E (delete-account dialog, Figma UI-51). */
  tone?: "primary" | "success";
}

const CHECK_ICON =
  "checked:[background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-width=%223%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m5 12.5 4.5 4.5L19 7.5%22/></svg>')]";

export function Checkbox({ label, className, id, tone = "primary", ...props }: CheckboxProps) {
  return (
    <label htmlFor={id} className={cn("inline-flex cursor-pointer items-center gap-2 text-xs text-text", className)}>
      <input
        id={id}
        type="checkbox"
        className={cn(
          "size-4 cursor-pointer appearance-none rounded border border-border-strong bg-white checked:bg-center checked:bg-no-repeat",
          tone === "success" ? "checked:border-success-strong checked:bg-success-strong" : "checked:border-primary checked:bg-primary",
          CHECK_ICON,
        )}
        {...props}
      />
      {label}
    </label>
  );
}
