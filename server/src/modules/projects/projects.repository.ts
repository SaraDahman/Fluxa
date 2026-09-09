import { prisma } from "../../lib/prisma";

import type { CreateProjectBody } from "./dto/create-project.schema";
import type { UpdateProjectBody } from "./dto/update-project.schema";

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

  create(
    data: CreateProjectBody & { workspaceId: string; createdBy: string },
    addCreatorAsMember: boolean
  ) {
    return prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          name: data.name,
          key: data.key,
          description: data.description,
          workspaceId: data.workspaceId,
          teamId: data.teamId,
          createdBy: data.createdBy,
        },
      });

      if (addCreatorAsMember) {
        await tx.projectMember.create({
          data: {
            projectId: project.id,
            userId: data.createdBy,
            role: "ADMIN",
          },
        });
      }

      return project;
    });
  },

  update(projectId: string, data: UpdateProjectBody) {
    return prisma.project.update({
      where: { id: projectId },
      data,
    });
  },
};
