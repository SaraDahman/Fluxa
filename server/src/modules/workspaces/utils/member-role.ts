import type { WorkspaceRole } from "../../../../generated/prisma/enums";

const ROLE_RANK: Record<WorkspaceRole, number> = {
  OWNER: 3,
  ADMIN: 2,
  MEMBER: 1,
};

export function hasRole(role: WorkspaceRole, minimumRole: WorkspaceRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minimumRole];
}
