import type { MemberRole } from "../../../../generated/prisma/enums";

const ROLE_RANK: Record<MemberRole, number> = {
  OWNER: 3,
  ADMIN: 2,
  MEMBER: 1,
};

export function hasRole(role: MemberRole, minimumRole: MemberRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minimumRole];
}
