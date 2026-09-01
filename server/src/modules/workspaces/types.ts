import type { WorkspaceRole } from "../../../generated/prisma/enums";
import type { WorkspaceModel } from "../../../generated/prisma/models/Workspace";

export type WorkspaceWithRole = {
  workspace: WorkspaceModel;
  role: WorkspaceRole;
};

export type WorkspaceMemberWithUser = {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  createdAt: Date;
  user: {
    id: string;
    email: string;
    username: string | null;
    title: string | null;
    avatar: string | null;
  };
};
