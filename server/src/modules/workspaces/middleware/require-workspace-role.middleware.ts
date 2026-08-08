import type { NextFunction, Response } from "express";

import type { MemberRole } from "../../../../generated/prisma/enums";

import type { WorkspaceRequest } from "../types";

import { ApiError } from "../../../utils/api-error";

import { hasRole } from "../utils/member-role";

import { workspaceRepository } from "../workspace.repository";

export function requireWorkspaceRole(minimumRole: MemberRole) {
  return async (req: WorkspaceRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const { workspaceId } = req.params as { workspaceId: string };

      const membership = await workspaceRepository.findMembership(workspaceId, req.user!.userId);

      if (!membership) {
        next(new ApiError(404, "Workspace not found"));
        return;
      }

      if (!hasRole(membership.role, minimumRole)) {
        next(new ApiError(403, "You do not have permission to perform this action"));
        return;
      }

      req.membership = membership;
      next();
    } catch (error) {
      next(error);
    }
  };
}
