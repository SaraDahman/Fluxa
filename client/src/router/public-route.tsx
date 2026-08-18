import { Outlet } from "react-router-dom";

import { FullPageLoader } from "@/shared/components/common/FullPageLoader";

import { useMe } from "@/features/auth/api/auth";

import ProtectedRoute from "./protected-route";

export default function PublicRoute() {
  const { data, isLoading } = useMe();

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (data) {
    return <ProtectedRoute />;
  }

  return <Outlet />;
}
