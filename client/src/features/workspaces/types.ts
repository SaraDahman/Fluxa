export interface Workspace {
  id: string;
  name: string;
  slug: string;
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
