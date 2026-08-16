import { Navigate, Outlet, useLocation } from "react-router-dom";

import { FullPageLoader } from "@/shared/components/common/FullPageLoader";

import { useMe } from "@/features/auth/api/auth";
import { useWorkspaceStore } from "@/store/workspace.store";

import { PATHS } from "./paths";

export default function ProtectedRoute() {
  const location = useLocation();
  const { activeWorkspaceSlug } = useWorkspaceStore();

  const { data, isLoading, isError } = useMe();

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (isError || !data) {
    return <Navigate to={PATHS.SIGN_IN} replace />;
  }

  const { user, workspaces } = data;

  if (workspaces.length === 0) {
    if (location.pathname !== PATHS.CREATE_WORKSPACE) {
      return <Navigate to={PATHS.CREATE_WORKSPACE} replace />;
    }

    return <Outlet />;
  }

  if (!user.profileComplete) {
    if (location.pathname !== PATHS.COMPLETE_PROFILE) {
      return <Navigate to={PATHS.COMPLETE_PROFILE} replace />;
    }

    return <Outlet />;
  }

  const firstSegment = location.pathname.split("/")[1];
  const onWorkspaceRoute = workspaces.some((w) => w.workspace.slug === firstSegment);
  const onSelectWorkspace = location.pathname === PATHS.SELECT_WORKSPACE;

  if (onWorkspaceRoute || onSelectWorkspace) {
    return <Outlet />;
  }

  if (activeWorkspaceSlug && workspaces.some((w) => w.workspace.slug === activeWorkspaceSlug)) {
    return <Navigate to={`/${activeWorkspaceSlug}/my-tasks`} replace />;
  }

  if (workspaces.length === 1) {
    return <Navigate to={`/${workspaces[0].workspace.slug}/my-tasks`} replace />;
  }

  return <Navigate to={PATHS.SELECT_WORKSPACE} replace />;
}
