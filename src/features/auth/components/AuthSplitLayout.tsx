import Image from "next/image";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";
import { AuthDecor } from "./AuthDecor";

interface AuthSplitLayoutProps {
  heading: ReactNode;
  subtitle: string;
  mascot: string;
  title: string;
  children: ReactNode;
}

/** Login / register layout: hero copy + mascot on one side, white form card on the other. */
export function AuthSplitLayout({ heading, subtitle, mascot, title, children }: AuthSplitLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-primary-faint">
      <AuthDecor />
      <div className="relative mx-auto grid min-h-screen w-full max-w-[1120px] grid-cols-1 items-center gap-10 px-5 py-8 md:px-6 md:py-10 lg:grid-cols-2">
        <div className="order-2 flex flex-col items-center text-center lg:order-2">
          <h1 className="text-[28px] font-bold leading-[1.5] text-text-heading md:text-[34px]">{heading}</h1>
          <p className="mt-2 text-sm text-text-muted">{subtitle}</p>
          <Image src={mascot} alt="" width={1000} height={800} className="mt-6 h-auto w-full max-w-[480px]" priority />
        </div>
        <div className="order-1 relative w-full max-w-[460px] justify-self-center overflow-hidden rounded-2xl bg-white px-6 py-8 shadow-card md:px-9 lg:order-1 lg:justify-self-start">
          <span className="dots-arc pointer-events-none absolute -start-2 -top-2 size-40" aria-hidden />
          <div className="relative flex flex-col items-center">
            <Logo width={140} href="/" />
            <h2 className="mt-2 text-xl font-bold text-text-heading">{title}</h2>
          </div>
          <div className="relative mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
