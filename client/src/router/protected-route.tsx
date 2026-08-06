import { Navigate, Outlet } from "react-router-dom";

import { getAccessToken } from "@/features/auth/lib/auth-session";

import { PATHS } from "./paths";

export default function ProtectedRoute() {
  const isAuthenticated = getAccessToken() !== null;

  if (!isAuthenticated) {
    return <Navigate to={PATHS.SIGN_IN} replace />;
  }

  return <Outlet />;
}
