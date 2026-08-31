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
  create(data: CreateTeamBody & { workspaceId: string }) {
    return prisma.team.create({
      data: {
        name: data.name,
        description: data.description,
        workspaceId: data.workspaceId,
      },
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

  listByWorkspace(workspaceId: string, skip: number, take: number) {
    return prisma.team.findMany({
      where: { workspaceId },
      include: {
        _count: { select: { members: true } },
      },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      skip,
      take,
    });
  },

  countByWorkspace(workspaceId: string) {
    return prisma.team.count({ where: { workspaceId } });
  },

  listByWorkspaceForUser(workspaceId: string, userId: string, skip: number, take: number) {
    return prisma.team.findMany({
      where: {
        workspaceId,
        members: { some: { userId } },
      },
      include: {
        _count: { select: { members: true } },
      },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      skip,
      take,
    });
  },

  countByWorkspaceForUser(workspaceId: string, userId: string) {
    return prisma.team.count({
      where: {
        workspaceId,
        members: { some: { userId } },
      },
    });
  },

  findWithMembers(teamId: string, workspaceId: string) {
    return prisma.team.findFirst({
      where: { id: teamId, workspaceId },
      include: {
        members: {
          include: { user: { select: userSelect } },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  },
};
