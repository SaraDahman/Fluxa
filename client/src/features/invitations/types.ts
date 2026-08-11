import type { WorkspaceRole } from "@/features/workspaces/types";

export type InvitationStatus = "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED";

export interface InvitationWorkspace {
  id: string;
  name: string;
}

export interface InvitationPreview {
  workspace: InvitationWorkspace;
  role: WorkspaceRole;
  email: string;
  status: InvitationStatus;
  expiresAt: string | null;
}

export interface InvitationPreviewResponse {
  success: boolean;
  data: InvitationPreview;
}

export interface AcceptInvitationResponse {
  success: boolean;
  message: string;
  data: {
    workspaceId: string;
    role: WorkspaceRole;
  };
}
