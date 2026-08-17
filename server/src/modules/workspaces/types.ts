import type { MemberRole } from "../../../generated/prisma/enums";
import type { WorkspaceMemberModel } from "../../../generated/prisma/models/WorkspaceMember";
import type { WorkspaceModel } from "../../../generated/prisma/models/Workspace";

import type { AuthenticatedRequest } from "../auth/types";

export interface WorkspaceRequest extends AuthenticatedRequest {
  membership?: WorkspaceMemberModel;
}

export type WorkspaceWithRole = {
  workspace: WorkspaceModel;
  role: MemberRole;
};

export type MemberActor = {
  userId: string;
  role: MemberRole;
};

export type WorkspaceMemberWithUser = {
  id: string;
  workspaceId: string;
  userId: string;
  role: MemberRole;
  createdAt: Date;
  user: {
    id: string;
    email: string;
    username: string | null;
    title: string | null;
    avatar: string | null;
  };
};
