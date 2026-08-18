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

export type InvitationPreviewDto = {
  workspace: { id: string; name: string };
  role: InvitationRole;
  email: string;
  status: string;
  expiresAt: Date | null;
};
