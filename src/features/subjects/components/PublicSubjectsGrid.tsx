import { cn } from "@/lib/utils";
import { SubjectCard } from "./SubjectCard";
import type { Subject } from "../types/subject.types";

interface PublicSubjectsGridProps {
  subjects: Subject[];
  highlightIndex?: number;
  className?: string;
}

/** Grid of public course cards, each linking to its subject details page. */
export function PublicSubjectsGrid({ subjects, highlightIndex, className }: PublicSubjectsGridProps) {
  return (
    <div className={cn("grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3", className)}>
      {subjects.map((s, i) => (
        <SubjectCard key={s.uuid} subject={s} highlighted={i === highlightIndex} />
      ))}
    </div>
  );
}
