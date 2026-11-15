import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  white?: boolean;
  width?: number;
  href?: string;
}

/** Aljoodi Academy logo (identity boat mark + wordmark, SVG). `white` renders the inverted variant for teal surfaces. */
export function Logo({ className, white, width = 120, href = "/" }: LogoProps) {
  const img = (
    <Image
      src="/images/logo.svg"
      alt="Aljoodi Academy"
      width={width}
      height={Math.round(width * 0.67)}
      priority
      unoptimized
      className={cn(white && "brightness-0 invert", className)}
    />
  );
  return href ? (
    <Link href={href} className="inline-flex shrink-0">
      {img}
    </Link>
  ) : (
    img
  );
}
