"use client";

import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CloseIcon } from "./Icons";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  showClose?: boolean;
}

/**
 * Centered modal with blurred backdrop (Figma UI-51): the dialog is vertically and horizontally centered in the
 * viewport and the plain close (X) button sits on the top-LEFT inside the container (`end` = left in RTL) so it never
 * overlaps the right-aligned title.
 */
export function Modal({ open, onClose, children, className, showClose = true }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-white/40 p-6 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={cn("relative my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-card", className)}
      >
        {showClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute end-5 top-5 flex size-8 items-center justify-center rounded-lg text-text-muted transition hover:bg-surface hover:text-text-heading"
            aria-label="close"
          >
            <CloseIcon size={18} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
