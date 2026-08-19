import type { MemberRole } from "../../../generated/prisma/enums";
import type { TeamRole } from "../../../generated/prisma/enums";
import type { TeamModel } from "../../../generated/prisma/models/Team";

export type CreateTeamBody = {
  name: string;
  description?: string;
};

export type TeamActor = {
  userId: string;
  role: MemberRole;
};

export type TeamWithMembers = TeamModel & {
  members: TeamMemberWithUser[];
};

export type TeamMemberWithUser = {
  id: string;
  teamId: string;
  userId: string;
  role: TeamRole;
  createdAt: Date;
  user: {
    id: string;
    email: string;
    username: string | null;
    title: string | null;
    avatar: string | null;
  };
};
