import { prisma } from "../../lib/prisma";

import type { CreateTeamBody } from "./dto/create-team.schema";

const userSelect = {
  id: true,
  email: true,
  username: true,
  title: true,
  avatar: true,
} as const;

export const teamRepository = {
  createWithMember(data: CreateTeamBody & { workspaceId: string; userId: string }) {
    return prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: {
          name: data.name,
          description: data.description,
          workspaceId: data.workspaceId,
        },
      });

      const member = await tx.teamMember.create({
        data: {
          teamId: team.id,
          userId: data.userId,
          role: "LEAD",
        },
        include: { user: { select: userSelect } },
      });

      return { team, member };
    });
  },

  findByWorkspaceAndName(workspaceId: string, name: string) {
    return prisma.team.findFirst({
      where: { workspaceId, name },
    });
  },

  findUnique(teamId: string) {
    return prisma.team.findUnique({ where: { id: teamId } });
  },

  findMember(teamId: string, userId: string) {
    return prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });
  },

  listByWorkspace(workspaceId: string) {
    return prisma.team.findMany({
      where: { workspaceId },
      include: {
        _count: { select: { members: true } },
      },
      orderBy: { createdAt: "asc" },
    });
  },

  listByWorkspaceForUser(workspaceId: string, userId: string) {
    return prisma.team.findMany({
      where: {
        workspaceId,
        members: { some: { userId } },
      },
      include: {
        _count: { select: { members: true } },
      },
      orderBy: { createdAt: "asc" },
    });
  },

  findWithMembers(teamId: string) {
    return prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: { user: { select: userSelect } },
          orderBy: [{ role: "asc" }, { createdAt: "asc" }],
        },
      },
    });
  },
};
