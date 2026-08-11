import type { WorkspaceRole } from "@/features/workspaces/types";

const ROLE_LABELS: Record<WorkspaceRole, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MEMBER: "Member",
};

export function formatRole(role: WorkspaceRole): string {
  return ROLE_LABELS[role];
}
