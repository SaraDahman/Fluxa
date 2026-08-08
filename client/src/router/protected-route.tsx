import { Navigate, Outlet, useLocation } from "react-router-dom";

import { FullPageLoader } from "@/shared/components/common/FullPageLoader";

import { useOnboardingStatus } from "@/features/auth/lib/use-onboarding-status";

import { PATHS } from "./paths";

export default function ProtectedRoute() {
  const location = useLocation();

  const { status, targetPath } = useOnboardingStatus();

  if (status === "loading") {
    return <FullPageLoader />;
  }

  if (status === "unauthenticated") {
    return <Navigate to={PATHS.SIGN_IN} replace />;
  }

  if (location.pathname !== targetPath) {
    return <Navigate to={targetPath} replace />;
  }

  return <Outlet />;
}
