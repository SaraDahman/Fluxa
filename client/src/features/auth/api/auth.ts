import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import { getAccessToken } from "@/features/auth/lib/auth-session";

import type { AuthUser } from "../types";
import type { WorkspaceWithRole } from "@/features/workspaces/types";

export type GetMeResponse = {
  success: boolean;
  data: {
    user: AuthUser;
    workspaces: WorkspaceWithRole[];
  };
};

export function useMe() {
  const hasToken = !!getAccessToken();

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await apiClient.get<GetMeResponse>("/auth/me");
      return response.data.data;
    },
    enabled: hasToken,
  });
}
