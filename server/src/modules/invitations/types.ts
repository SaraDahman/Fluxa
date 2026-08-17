import type { InvitationStatus } from "../../../generated/prisma/enums";
import type { WorkspaceInvitationModel } from "../../../generated/prisma/models/WorkspaceInvitation";

export type InvitationRole = "ADMIN" | "MEMBER";

export type CreateInvitationData = {
  workspaceId: string;
  email: string;
  token: string;
  role: InvitationRole;
  invitedById: string;
  expiresAt: Date;
};

export type UpdateInvitationData = {
  token: string;
  role: InvitationRole;
  expiresAt: Date;
};

export type InvitationWithWorkspace = WorkspaceInvitationModel & {
  workspace: { id: string; name: string };
};
