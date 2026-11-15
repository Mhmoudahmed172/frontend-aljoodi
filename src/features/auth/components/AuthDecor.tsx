import { TriangleIcon } from "@/components/ui/Icons";

/** Background decorations shared by auth screens (yellow blob, dashed curve, circles). */
export function AuthDecor() {
  return (
    <>
      {/* Figma: yellow glow top-LEFT of the screen and bottom-RIGHT behind the card (`end` = left in RTL). */}
      <div className="pointer-events-none absolute -end-24 -top-24 size-80 rounded-full bg-accent/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -start-24 size-80 rounded-full bg-accent/30 blur-3xl" />
      <svg className="pointer-events-none absolute inset-x-0 top-1/3 h-72 w-full text-accent" viewBox="0 0 1280 300" fill="none" preserveAspectRatio="none">
        <path d="M-20 40 C 250 380, 900 380, 1300 120" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" />
      </svg>
      <span className="pointer-events-none absolute start-[45%] top-14 size-9 rounded-full bg-primary-soft" />
      <span className="pointer-events-none absolute start-[47%] top-32 size-3 rounded-full bg-primary-soft" />
      <span className="pointer-events-none absolute bottom-24 start-8 size-9 rounded-full bg-primary-soft" />
      <span className="pointer-events-none absolute bottom-10 start-[30%] size-3 rounded-full bg-primary-soft" />
      <TriangleIcon size={10} className="pointer-events-none absolute start-[52%] top-[22%] text-primary-soft" />
    </>
  );
}

/** Decorations for the single-card password flows (dashed loop, triangle, star, circles). */
export function CardFlowDecor() {
  return (
    <>
      <span className="pointer-events-none absolute -start-40 top-1/4 size-[560px] rounded-full bg-primary-soft/30" />
      <span className="pointer-events-none absolute -bottom-40 -start-40 h-80 w-[900px] rounded-[50%] bg-white/70" />
      <svg className="pointer-events-none absolute end-24 top-1/3 h-44 w-44 -scale-x-100 text-primary-light" viewBox="0 0 160 160" fill="none">
        <path d="M20 20 C -10 80, 60 110, 70 60 C 80 20, 20 30, 40 80 C 55 120, 110 120, 150 140" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
      </svg>
      <TriangleIcon size={20} className="pointer-events-none absolute end-16 top-[55%] rotate-90 text-primary-soft" />
      <span className="pointer-events-none absolute start-32 top-1/4 size-5 rounded-full bg-primary-light" />
      <svg className="pointer-events-none absolute bottom-[22%] start-24 size-10 text-primary-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7L12 3Z" />
      </svg>
      <span className="pointer-events-none absolute end-[38%] top-[26%] size-14 rounded-full bg-accent-soft blur-md" />
    </>
  );
}
