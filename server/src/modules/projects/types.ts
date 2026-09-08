import type { ProjectRole } from "../../../generated/prisma/enums";

export type ProjectMemberWithUser = {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectRole;
  createdAt: Date;
  user: {
    id: string;
    email: string;
    username: string | null;
    title: string | null;
    avatar: string | null;
  };
};
