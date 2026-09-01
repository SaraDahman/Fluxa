import type { ProjectRole, WorkspaceRole } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { PROJECT_ROLE_PERMISSIONS, WORKSPACE_ROLE_PERMISSIONS, type Permission } from "./constants";

export interface ResolvedAccess {
  permissions: Set<Permission>;
  workspaceRole: WorkspaceRole | null;
  projectRole: ProjectRole | null;
}

/**
 * Resolves a user's effective permissions on a specific project.
 * Source of truth for every project/sprint/task permission check —
 * routes should never query WorkspaceMember/ProjectMember directly,
 * always go through this function so the rule lives in one place.
 *
 * Returns null only when the project does not exist (→ 404). When the
 * user exists in the project's workspace but holds no project role,
 * the result is an empty-but-defined access (→ 403).
 */
export async function resolveProjectAccess(
  userId: string,
  projectId: string
): Promise<ResolvedAccess | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { workspaceId: true },
  });
  if (!project) return null;

  const [workspaceMember, projectMember] = await Promise.all([
    prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: project.workspaceId, userId } },
    }),
    prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    }),
  ]);

  const fromWorkspace = workspaceMember
    ? (WORKSPACE_ROLE_PERMISSIONS[workspaceMember.role] ?? [])
    : [];
  const fromProject = projectMember ? (PROJECT_ROLE_PERMISSIONS[projectMember.role] ?? []) : [];

  return {
    permissions: new Set([...fromWorkspace, ...fromProject]),
    workspaceRole: workspaceMember?.role ?? null,
    projectRole: projectMember?.role ?? null,
  };
}

/**
 * Resolves a user's permissions at the workspace level only — for
 * actions that don't reference a project at all (invite, set role,
 * delete workspace, create team/project).
 */
export async function resolveWorkspaceAccess(
  userId: string,
  workspaceId: string
): Promise<ResolvedAccess | null> {
  const workspaceMember = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } },
  });
  if (!workspaceMember) return null;

  return {
    permissions: new Set(WORKSPACE_ROLE_PERMISSIONS[workspaceMember.role] ?? []),
    workspaceRole: workspaceMember.role,
    projectRole: null,
  };
}
