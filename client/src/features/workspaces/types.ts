export interface Workspace {
  id: string;
  name: string;
  slug: string;
  color: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER";

export interface WorkspaceWithRole {
  workspace: Workspace;
  role: WorkspaceRole;
}

export interface CreateWorkspaceResponse {
  success: boolean;
  message: string;
  data: WorkspaceWithRole;
}

export type InvitationRole = "MEMBER" | "ADMIN";

export type InvitationStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";

export interface Invitation {
  id: string;
  email: string;
  role: InvitationRole;
  status: InvitationStatus;
  token: string;
  workspaceId: string;
  invitedById: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface InviteMemberResponse {
  success: boolean;
  message: string;
  data: {
    invitation: Invitation;
  };
}
