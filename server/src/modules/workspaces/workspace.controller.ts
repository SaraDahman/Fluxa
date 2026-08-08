import type { Response } from "express";

import type { AuthenticatedRequest } from "../auth/types";
import type { WorkspaceRequest } from "./types";

import { workspaceService } from "./workspace.service";

import type { CreateWorkspaceBody } from "./dto/create-workspace.schema";
import type { MemberParams } from "./dto/member-params.schema";
import type { UpdateMemberRoleBody } from "./dto/update-member-role.schema";
import type { WorkspaceParams } from "./dto/workspace-params.schema";

export const workspaceController = {
  async createWorkspace(req: AuthenticatedRequest, res: Response) {
    const body = req.body as CreateWorkspaceBody;

    const workspace = await workspaceService.createWorkspace(req.user!.userId, body);

    res.status(201).json({
      success: true,
      message: "Workspace created successfully",
      data: workspace,
    });
  },

  async listWorkspaces(req: AuthenticatedRequest, res: Response) {
    const workspaces = await workspaceService.listWorkspaces(req.user!.userId);

    res.json({
      success: true,
      data: workspaces,
    });
  },

  async getWorkspace(req: AuthenticatedRequest, res: Response) {
    const { workspaceId } = req.params as unknown as WorkspaceParams;

    const workspace = await workspaceService.getWorkspace(req.user!.userId, workspaceId);

    res.json({
      success: true,
      data: workspace,
    });
  },

  async listMembers(req: WorkspaceRequest, res: Response) {
    const { workspaceId } = req.params as unknown as WorkspaceParams;

    const members = await workspaceService.listMembers(workspaceId);

    res.json({
      success: true,
      data: members,
    });
  },

  async updateMemberRole(req: WorkspaceRequest, res: Response) {
    const { workspaceId, userId } = req.params as unknown as MemberParams;
    const { role } = req.body as UpdateMemberRoleBody;

    const member = await workspaceService.updateMemberRole(
      { userId: req.user!.userId, role: req.membership!.role },
      workspaceId,
      userId,
      role
    );

    res.json({
      success: true,
      message: "Member role updated successfully",
      data: member,
    });
  },

  async removeMember(req: WorkspaceRequest, res: Response) {
    const { workspaceId, userId } = req.params as unknown as MemberParams;

    await workspaceService.removeMember(
      { userId: req.user!.userId, role: req.membership!.role },
      workspaceId,
      userId
    );

    res.json({
      success: true,
      message: "Member removed successfully",
    });
  },
};
