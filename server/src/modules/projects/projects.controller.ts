import type { NextFunction, Response } from "express";

import type { AuthenticatedRequest } from "../auth/types";

import { projectService } from "./projects.service";

import type { CreateProjectBody } from "./dto/create-project.schema";
import type { WorkspaceParams } from "./dto/workspace-params.schema";

export const projectController = {
  async createProject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params as WorkspaceParams;
      const body = req.body as CreateProjectBody;

      const project = await projectService.createProject(req.user!.userId, workspaceId, body);

      res.status(201).json({
        success: true,
        message: "Project created successfully",
        data: project,
      });
    } catch (error) {
      next(error);
    }
  },
};
