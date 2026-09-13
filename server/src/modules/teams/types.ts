import type { ProjectModel } from "../../../generated/prisma/models/Project";
import type { TeamModel } from "../../../generated/prisma/models/Team";

export type TeamWithMembers = TeamModel & {
  members: TeamMemberWithUser[];
};

export type TeamSummary = TeamModel & {
  _count: { members: number };
};

export type TeamProjectWithAccess = ProjectModel & {
  hasAccess: boolean;
};

export type TeamMemberWithUser = {
  id: string;
  teamId: string;
  userId: string;
  createdAt: Date;
  user: {
    id: string;
    email: string;
    username: string | null;
    title: string | null;
    avatar: string | null;
  };
};
