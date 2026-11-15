"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { CheckCircleSolidIcon, PaperPlaneIcon, TriangleIcon } from "@/components/ui/Icons";
import type { AuthUser } from "@/features/auth/types/auth.types";

const FALLBACK_AVATAR = "/images/avatar-shahd.png";

interface ProfileHeroProps {
  variant?: "full" | "card";
  showEmail?: boolean;
  /** The signed-in user; renders placeholders while `undefined`/loading. */
  user?: AuthUser;
  loading?: boolean;
}

/** Profile hero band: avatar with ring, student badge, name, email, member since. */
export function ProfileHero({ variant = "card", showEmail = false, user, loading = false }: ProfileHeroProps) {
  const { t } = useT();
  const name = loading ? "" : (user?.name ?? t("common.notAdded"));
  const email = loading ? "" : (user?.email ?? t("common.notAdded"));

  return (
    <div className={cn("relative overflow-hidden bg-primary-subtle", variant === "card" && "rounded-2xl")}>
      <Image src="/images/banner-bg-wide.png" alt="" fill className="object-cover opacity-90" sizes="1280px" />
      <span className="pointer-events-none absolute -end-10 -top-16 size-64 rounded-full bg-primary/10" />
      <div className="relative flex items-center justify-between gap-6 px-8 py-6 md:px-12">
        <div className="flex items-center gap-5">
          <span className="rounded-full border-4 border-primary-light p-0.5">
            <Avatar src={user?.avatar_url ?? FALLBACK_AVATAR} alt="" size={104} />
          </span>
          <div className="flex flex-col items-start gap-1">
            <span className="flex items-center gap-1 rounded-full bg-primary-soft px-3 py-0.5 text-[10px] font-semibold text-primary">
              <CheckCircleSolidIcon size={12} />
              {t("common.studentAt")}
            </span>
            <h1 className="text-2xl font-black text-text-heading">{name}</h1>
            {showEmail && (
              <span className="text-xs text-text" dir="ltr">
                {email}
              </span>
            )}
            {/* No `created_at`/join-date field is exposed by `UserResource` yet, so this stays a static badge tied to the current year rather than a real member-since date. */}
            <span className="text-[11px] font-semibold text-accent">{t("common.memberSince", { year: new Date().getFullYear() })}</span>
          </div>
        </div>
        <div className="relative hidden h-36 w-72 shrink-0 md:block">
          <span className="dots-pattern absolute bottom-0 start-0 size-28" />
          <PaperPlaneIcon size={36} strokeWidth={1.4} className="absolute end-2 top-2 text-primary" />
          <Image src="/images/decor-arrow-dashed.png" alt="" width={64} height={80} className="absolute end-14 top-8 -scale-x-100 opacity-70" />
          <TriangleIcon size={10} className="absolute start-24 top-[60%] -rotate-90 text-primary" />
          <Image src="/images/mascot-laptop@2x.png" alt="" width={150} height={140} className="absolute bottom-0 start-6 h-32 w-auto object-contain" />
        </div>
      </div>
    </div>
  );
}
