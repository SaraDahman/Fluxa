import type { NextFunction, Response } from "express";

import type { AuthenticatedRequest } from "../auth/types";
import type { PermissionRequest } from "../../permissions/types";

import { workspaceService } from "./workspace.service";

import type { CreateWorkspaceBody } from "./dto/create-workspace.schema";
import type { MemberParams } from "./dto/member-params.schema";
import type { UpdateMemberRoleBody } from "./dto/update-member-role.schema";
import type { WorkspaceParams } from "./dto/workspace-params.schema";

export const workspaceController = {
  async createWorkspace(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const body = req.body as CreateWorkspaceBody;

      const workspace = await workspaceService.createWorkspace(req.user!.userId, body);

      res.status(201).json({
        success: true,
        message: "Workspace created successfully",
        data: workspace,
      });
    } catch (error) {
      next(error);
    }
  },

  async listWorkspaces(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const workspaces = await workspaceService.listWorkspaces(req.user!.userId);

      res.json({
        success: true,
        data: workspaces,
      });
    } catch (error) {
      next(error);
    }
  },

  async getWorkspace(req: PermissionRequest, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params as unknown as WorkspaceParams;

      const workspace = await workspaceService.getWorkspace(workspaceId);

      res.json({
        success: true,
        data: {
          workspace,
          role: req.access!.workspaceRole!,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async listMembers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params as unknown as WorkspaceParams;

      const members = await workspaceService.listMembers(workspaceId);

      res.json({
        success: true,
        data: members,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateMemberRole(req: PermissionRequest, res: Response, next: NextFunction) {
    try {
      const { workspaceId, userId } = req.params as unknown as MemberParams;
      const { role } = req.body as UpdateMemberRoleBody;

      const member = await workspaceService.updateMemberRole(
        req.user!.userId,
        workspaceId,
        userId,
        role
      );

      res.json({
        success: true,
        message: "Member role updated successfully",
        data: member,
      });
    } catch (error) {
      next(error);
    }
  },

  async removeMember(req: PermissionRequest, res: Response, next: NextFunction) {
    try {
      const { workspaceId, userId } = req.params as unknown as MemberParams;

      await workspaceService.removeMember(workspaceId, userId);

      res.json({
        success: true,
        message: "Member removed successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  async leaveWorkspace(req: PermissionRequest, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params as unknown as WorkspaceParams;

      await workspaceService.leaveWorkspace(req.user!.userId, workspaceId);

      res.json({
        success: true,
        message: "You left the workspace",
      });
    } catch (error) {
      next(error);
    }
  },
};
