import { Suspense } from "react";
import { AuthCardLayout } from "@/features/auth/components/AuthCardLayout";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthCardLayout>
      {/* ResetPasswordForm reads `mobile`/`reset_token` via useSearchParams(), which requires a Suspense boundary. */}
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </AuthCardLayout>
  );
}
