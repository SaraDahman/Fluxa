import { prisma } from "../../lib/prisma";

import type { CreateProjectBody } from "./dto/create-project.schema";

export const projectRepository = {
  findByWorkspaceAndKey(workspaceId: string, key: string) {
    return prisma.project.findFirst({
      where: { workspaceId, key },
    });
  },

  findTeamInWorkspace(teamId: string, workspaceId: string) {
    return prisma.team.findFirst({
      where: { id: teamId, workspaceId },
      select: { id: true },
    });
  },

  create(data: CreateProjectBody & { workspaceId: string; createdBy: string }) {
    return prisma.project.create({
      data: {
        name: data.name,
        key: data.key,
        description: data.description,
        workspaceId: data.workspaceId,
        teamId: data.teamId,
        createdBy: data.createdBy,
      },
    });
  },
};
