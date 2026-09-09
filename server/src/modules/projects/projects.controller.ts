import type { NextFunction, Response } from "express";

import type { AuthenticatedRequest } from "../auth/types";

import { projectService } from "./projects.service";

import type { CreateProjectBody } from "./dto/create-project.schema";
import type { ProjectParams } from "./dto/project-params.schema";
import type { UpdateProjectBody } from "./dto/update-project.schema";
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

  async updateProject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { workspaceId, projectId } = req.params as ProjectParams;
      const body = req.body as UpdateProjectBody;

      const project = await projectService.updateProject(projectId, workspaceId, body);

      res.json({
        success: true,
        message: "Project updated successfully",
        data: project,
      });
    } catch (error) {
      next(error);
    }
  },
};
