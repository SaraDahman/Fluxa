import type { WorkspaceRole, ProjectRole } from "../../generated/prisma/enums";

/**
 * Permission keys, in "resource:action" form.
 * Grouping by resource (not verb) means every permission touching
 * one resource sorts together — the question you'll ask most often
 * is "what can touch Project X", not "what are all the create actions".
 */
export const PERMISSIONS = {
  WORKSPACE_VIEW: "workspace:view",
  WORKSPACE_UPDATE: "workspace:update",
  WORKSPACE_DELETE: "workspace:delete",
  WORKSPACE_INVITE: "workspace:invite",
  WORKSPACE_SET_ROLE: "workspace:setRole",

  TEAM_VIEW: "team:view",
  TEAM_CREATE: "team:create",
  TEAM_UPDATE: "team:update",
  TEAM_DELETE: "team:delete",
  // No team:addMember / team:removeMember — TeamMember is derived
  // from ProjectMember changes, never set directly by a user action.

  PROJECT_VIEW: "project:view",
  PROJECT_CREATE: "project:create",
  PROJECT_UPDATE: "project:update",
  PROJECT_DELETE: "project:delete",
  PROJECT_MANAGE_MEMBERS: "project:manageMembers",

  SPRINT_CREATE: "sprint:create",
  SPRINT_UPDATE: "sprint:update",
  SPRINT_CLOSE: "sprint:close",
  SPRINT_DELETE: "sprint:delete",

  TASK_VIEW: "task:view",
  TASK_CREATE: "task:create",
  TASK_UPDATE: "task:update",
  TASK_ASSIGN: "task:assign",
  TASK_DELETE: "task:delete",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// ── WorkspaceRole → permissions (apply everywhere in the workspace) ─
// "Sovereign project" model: the workspace role only covers top-level /
// container operations. Everything that happens INSIDE a project
// (tasks, sprints, project members) is decided by project membership
// alone, never by the workspace role.
export const WORKSPACE_ROLE_PERMISSIONS: Record<WorkspaceRole, Permission[]> = {
  MEMBER: [PERMISSIONS.WORKSPACE_VIEW, PERMISSIONS.TEAM_VIEW],

  ADMIN: [
    PERMISSIONS.WORKSPACE_VIEW,
    PERMISSIONS.WORKSPACE_INVITE,
    PERMISSIONS.TEAM_VIEW,
    PERMISSIONS.TEAM_CREATE,
    PERMISSIONS.TEAM_UPDATE,
    PERMISSIONS.TEAM_DELETE,
    PERMISSIONS.PROJECT_CREATE,
    PERMISSIONS.PROJECT_VIEW,
    PERMISSIONS.PROJECT_DELETE,
  ],

  OWNER: [], // filled below
};
WORKSPACE_ROLE_PERMISSIONS.OWNER = [
  ...WORKSPACE_ROLE_PERMISSIONS.ADMIN,
  PERMISSIONS.WORKSPACE_UPDATE,
  PERMISSIONS.WORKSPACE_DELETE,
  PERMISSIONS.WORKSPACE_SET_ROLE,
];

// ── ProjectRole → permissions, scoped to ONE project ────────────────
// The ONLY source of power inside a project. A workspace ADMIN who
// isn't a ProjectMember can see the project container, but cannot
// touch tasks, sprints, or project members.
export const PROJECT_ROLE_PERMISSIONS: Record<ProjectRole, Permission[]> = {
  MEMBER: [
    PERMISSIONS.PROJECT_VIEW,
    PERMISSIONS.TASK_VIEW,
    PERMISSIONS.TASK_CREATE,
    PERMISSIONS.TASK_UPDATE,
  ],

  ADMIN: [
    PERMISSIONS.PROJECT_VIEW,
    PERMISSIONS.PROJECT_UPDATE,
    PERMISSIONS.PROJECT_MANAGE_MEMBERS,
    PERMISSIONS.SPRINT_CREATE,
    PERMISSIONS.SPRINT_UPDATE,
    PERMISSIONS.SPRINT_CLOSE,
    PERMISSIONS.SPRINT_DELETE,
    PERMISSIONS.TASK_VIEW,
    PERMISSIONS.TASK_CREATE,
    PERMISSIONS.TASK_UPDATE,
    PERMISSIONS.TASK_ASSIGN,
    PERMISSIONS.TASK_DELETE,
    // PROJECT_DELETE deliberately excluded — destroying the container is
    // a workspace-level decision, so it stays workspace ADMIN/OWNER only.
  ],
};
