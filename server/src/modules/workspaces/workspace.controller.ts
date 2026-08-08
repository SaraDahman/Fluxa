import type { Response } from "express";

import type { AuthenticatedRequest } from "../auth/types";

import { workspaceService } from "./workspace.service";

import type { CreateWorkspaceBody } from "./dto/create-workspace.schema";
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
};
