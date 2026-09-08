import type { ProjectModel } from "../../../generated/prisma/models/Project";

import { ApiError } from "../../utils/api-error";

import { projectRepository } from "./projects.repository";

import type { CreateProjectBody } from "./dto/create-project.schema";

export const projectService = {
  async createProject(
    userId: string,
    workspaceId: string,
    data: CreateProjectBody
  ): Promise<ProjectModel> {
    const existing = await projectRepository.findByWorkspaceAndKey(workspaceId, data.key);

    if (existing) {
      throw new ApiError(409, "A project with this key already exists in this workspace");
    }

    if (data.teamId) {
      const team = await projectRepository.findTeamInWorkspace(data.teamId, workspaceId);

      if (!team) {
        throw new ApiError(404, "Team not found");
      }
    }

    return projectRepository.create({
      ...data,
      workspaceId,
      createdBy: userId,
    });
  },
};
