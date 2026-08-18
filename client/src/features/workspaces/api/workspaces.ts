import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";

import type { CreateWorkspaceResponse, InviteMemberResponse, InvitationRole } from "../types";

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; color?: string }) => {
      const response = await apiClient.post<CreateWorkspaceResponse>("/workspaces", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

export function useInviteMember(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; role: InvitationRole }) => {
      const response = await apiClient.post<InviteMemberResponse>(
        `/invitations/workspaces/${workspaceId}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces", workspaceId, "members"] });
    },
  });
}
