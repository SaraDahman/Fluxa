import type { WorkspaceRole } from "../../../generated/prisma/enums";
import type { WorkspaceMemberModel } from "../../../generated/prisma/models/WorkspaceMember";
import type { WorkspaceModel } from "../../../generated/prisma/models/Workspace";

import type { AuthenticatedRequest } from "../auth/types";

export interface WorkspaceRequest extends AuthenticatedRequest {
  membership?: WorkspaceMemberModel;
}

export type WorkspaceWithRole = {
  workspace: WorkspaceModel;
  role: WorkspaceRole;
};

export type MemberActor = {
  userId: string;
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
