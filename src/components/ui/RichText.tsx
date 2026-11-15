import { cn } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/utils/html";

interface RichTextProps {
  html: string | null | undefined;
  className?: string;
}

/** Renders API rich text (e.g. a teacher bio stored as `<p>…</p>`) as real markup instead of showing the raw tags. */
export function RichText({ html, className }: RichTextProps) {
  if (!html) return null;
  return (
    <div
      className={cn("[&_a]:text-primary [&_a]:underline [&_li]:list-inside [&_ol]:list-decimal [&_p+p]:mt-3 [&_ul]:list-disc", className)}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
}
