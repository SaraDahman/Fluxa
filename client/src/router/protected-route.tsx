import { matchPath, Navigate, Outlet, useLocation } from "react-router-dom";

import { FullPageLoader } from "@/shared/components/common/FullPageLoader";

import { useOnboardingStatus } from "@/features/auth/lib/use-onboarding-status";

import { PATHS } from "./paths";

export default function ProtectedRoute() {
  const location = useLocation();

  const { status, hasWorkspace, profileComplete } = useOnboardingStatus();

  if (status === "loading") {
    return <FullPageLoader />;
  }

  if (status === "unauthenticated") {
    return <Navigate to={PATHS.SIGN_IN} replace />;
  }

  if (!hasWorkspace) {
    if (location.pathname !== PATHS.CREATE_WORKSPACE) {
      return <Navigate to={PATHS.CREATE_WORKSPACE} replace />;
    }
    return <Outlet />;
  }

  if (!profileComplete) {
    if (location.pathname !== PATHS.COMPLETE_PROFILE) {
      return <Navigate to={PATHS.COMPLETE_PROFILE} replace />;
    }
    return <Outlet />;
  }

  const isWorkspaceRoute = matchPath("/workspace/:workspaceId/*", location.pathname) !== null;

  if (!isWorkspaceRoute) {
    return <Navigate to={PATHS.MY_TASKS} replace />;
  }

  return <Outlet />;
}
