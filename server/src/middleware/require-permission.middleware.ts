import type { NextFunction, Response } from "express";

import type { Permission } from "../permissions/constants";
import { resolveProjectAccess, resolveWorkspaceAccess } from "../permissions/resolve";
import type { PermissionRequest } from "../permissions/types";
import { ApiError } from "../utils/api-error";

/**
 * Gate a route by project-scoped permission.
 * Expects req.params.projectId (validated by the validate middleware,
 * which must run before this one) and req.user (set by authenticate,
 * which must also run before this).
 *
 * Note: access is resolved from the project's ACTUAL workspace (from
 * the DB), not the workspaceId in the URL — a project id from another
 * workspace can't slip through.
 *
 * Usage:
 *   router.delete('/:projectId/tasks/:taskId',
 *     authenticate,
 *     validate({ params: projectParamsSchema }),
 *     requireProjectPermission(PERMISSIONS.TASK_DELETE),
 *     taskController.remove
 *   );
 */
export function requireProjectPermission(permission: Permission) {
  return async (req: PermissionRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const { projectId } = req.params as { projectId: string };

      const access = await resolveProjectAccess(req.user!.userId, projectId);
      if (!access) {
        throw new ApiError(404, "Project not found");
      }
      if (!access.permissions.has(permission)) {
        throw new ApiError(403, "You do not have permission to perform this action");
      }

      req.access = access; // controllers can reuse this, no second lookup
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Gate a route by workspace-scoped permission (invite, setRole,
 * delete workspace, create/delete team/project — anything with no
 * projectId in the URL).
 * Expects req.params.workspaceId (validated by the validate middleware,
 * which must run before this one).
 *
 * Usage:
 *   router.post('/:workspaceId/invitations',
 *     authenticate,
 *     validate({ params: workspaceParamsSchema }),
 *     requireWorkspacePermission(PERMISSIONS.WORKSPACE_INVITE),
 *     invitationController.create
 *   );
 */
export function requireWorkspacePermission(permission: Permission) {
  return async (req: PermissionRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const { workspaceId } = req.params as { workspaceId: string };

      const access = await resolveWorkspaceAccess(req.user!.userId, workspaceId);
      if (!access) {
        throw new ApiError(404, "Workspace not found");
      }
      if (!access.permissions.has(permission)) {
        throw new ApiError(403, "You do not have permission to perform this action");
      }

      req.access = access;
      next();
    } catch (error) {
      next(error);
    }
  };
}
