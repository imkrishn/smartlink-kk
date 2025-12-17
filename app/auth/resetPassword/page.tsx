"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ResetPasswordForm from "@/components/ResetPassword";

export default function ResetPasswordPageWrapper() {
  return (
    <Suspense fallback={<div>Loading reset form...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
