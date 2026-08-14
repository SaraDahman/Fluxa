import { Outlet } from "react-router-dom";

import { FullPageLoader } from "@/shared/components/common/FullPageLoader";

import { useOnboardingStatus } from "@/features/auth/lib/use-onboarding-status";

import ProtectedRoute from "./protected-route";

export default function PublicRoute() {
  const { status } = useOnboardingStatus();

  if (status === "loading") {
    return <FullPageLoader />;
  }

  if (status === "authenticated") {
    return <ProtectedRoute />;
  }

  return <Outlet />;
}
