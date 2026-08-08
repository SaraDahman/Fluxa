import { Navigate, Outlet } from "react-router-dom";

import { FullPageLoader } from "@/shared/components/common/FullPageLoader";

import { useOnboardingStatus } from "@/features/auth/lib/use-onboarding-status";

export default function PublicRoute() {
  const { status, targetPath } = useOnboardingStatus();

  if (status === "loading") {
    return <FullPageLoader />;
  }

  if (status === "authenticated") {
    return <Navigate to={targetPath} replace />;
  }

  return <Outlet />;
}
