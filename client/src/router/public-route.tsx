import { Navigate, Outlet } from "react-router-dom";

import { getAccessToken, getStoredUser } from "@/features/auth/lib/auth-session";

import { PATHS } from "./paths";

export default function PublicRoute() {
  const isAuthenticated = getAccessToken() !== null;

  if (isAuthenticated) {
    const user = getStoredUser();

    return <Navigate to={user?.profileComplete ? PATHS.APP : PATHS.CREATE_WORKSPACE} replace />;
  }

  return <Outlet />;
}
