"use client";

import { Suspense } from "react";
import { useT } from "@/lib/i18n";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  const { t } = useT();
  return (
    <AuthSplitLayout
      title={t("auth.loginTitle")}
      subtitle={t("auth.loginHeroSubtitle")}
      mascot="/images/auth-login.webp"
      heading={
        <>
          {t("auth.loginHeroTitle1")} <span className="marker-yellow">{t("auth.loginHeroHighlight1")}</span> {t("auth.loginHeroTitle2")}
          <br />
          {t("auth.loginHeroTitle3")} <span className="marker-yellow">{t("auth.loginHeroHighlight2")}</span>
        </>
      }
    >
      {/* LoginForm reads `mobile` via useSearchParams(), which requires a Suspense boundary. */}
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthSplitLayout>
  );
}
