import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { apiClient } from "@/lib/api-client";

import type { AuthUser } from "@/features/auth/types";
import type { WorkspaceWithRole } from "@/features/workspaces/types";

import { PATHS } from "@/router/paths";

import { clearSession, getAccessToken, saveUser } from "./auth-session";

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

type GetMeResponse = {
  success: boolean;
  data: AuthUser;
};

type ListWorkspacesResponse = {
  success: boolean;
  data: WorkspaceWithRole[];
};

export function useOnboardingStatus() {
  const location = useLocation();

  const [status, setStatus] = useState<SessionStatus>("loading");
  const [targetPath, setTargetPath] = useState<string>(PATHS.APP);

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      if (!getAccessToken()) {
        if (!cancelled) setStatus("unauthenticated");
        return;
      }

      setStatus("loading");

      try {
        const [userRes, workspacesRes] = await Promise.all([
          apiClient.get<GetMeResponse>("/auth/me"),
          apiClient.get<ListWorkspacesResponse>("/workspaces"),
        ]);

        if (cancelled) return;

        const user = userRes.data.data;
        const hasWorkspace = workspacesRes.data.data.length > 0;

        saveUser(user);

        if (!hasWorkspace) setTargetPath(PATHS.CREATE_WORKSPACE);
        else if (!user.profileComplete) setTargetPath(PATHS.COMPLETE_PROFILE);
        else setTargetPath(PATHS.APP);

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

  return { status, targetPath };
}
