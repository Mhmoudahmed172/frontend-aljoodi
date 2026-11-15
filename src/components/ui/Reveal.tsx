"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms, applied only once the element becomes visible. */
  delay?: number;
}

/** Fades/slides children into place the first time they scroll into view. Respects prefers-reduced-motion. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Anything already inside the first viewport (e.g. the section right under the hero) must show at once,
    // otherwise it stays transparent and leaves a blank band until the user scrolls.
    // iOS 12.0/12.1 Safari has no IntersectionObserver; show the content rather than leaving it invisible.
    if (el.getBoundingClientRect().top < window.innerHeight || typeof IntersectionObserver === "undefined") {
      setVisible(true);

      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={cn(
        "reveal transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
