import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { apiClient } from "@/lib/api-client";

import type { AuthUser } from "@/features/auth/types";
import type { WorkspaceWithRole } from "@/features/workspaces/types";

import { clearSession, getAccessToken, saveUser } from "./auth-session";

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

type GetMeResponse = {
  success: boolean;
  data: {
    user: AuthUser;
    workspaces: WorkspaceWithRole[];
  };
};

export function useOnboardingStatus() {
  const location = useLocation();

  const [status, setStatus] = useState<SessionStatus>("loading");
  const [hasWorkspace, setHasWorkspace] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      if (!getAccessToken()) {
        if (!cancelled) setStatus("unauthenticated");
        return;
      }

      setStatus("loading");

      try {
        const response = await apiClient.get<GetMeResponse>("/auth/me");

        if (cancelled) return;

        const { user, workspaces } = response.data.data;

        saveUser(user);

        setHasWorkspace(workspaces.length > 0);
        setProfileComplete(user.profileComplete);
        setStatus("authenticated");
      } catch {
        clearSession();

        if (!cancelled) setStatus("unauthenticated");
      }
    }

    resolve();

    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  return { status, hasWorkspace, profileComplete };
}
