import type { MemberRole } from "../../../generated/prisma/enums";

import { prisma } from "../../lib/prisma";

import type { CreateWorkspaceBody } from "./dto/create-workspace.schema";

const userSelect = {
  id: true,
  email: true,
  username: true,
  title: true,
  avatar: true,
} as const;

export const workspaceRepository = {
  findBySlug(slug: string) {
    return prisma.workspace.findUnique({ where: { slug } });
  },

  findByOwnerAndName(createdBy: string, name: string) {
    return prisma.workspace.findUnique({
      where: { createdBy_name: { createdBy, name } },
    });
  },

  findMembership(workspaceId: string, userId: string) {
    return prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
      include: { workspace: true },
    });
  },

  listMembershipsByUser(userId: string) {
    return prisma.workspaceMember.findMany({
      where: { userId },
      include: { workspace: true },
      orderBy: { createdAt: "asc" },
    });
  },

  createWorkspaceWithOwner(data: CreateWorkspaceBody & { slug: string; createdBy: string }) {
    return prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data,
      });

      const membership = await tx.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId: data.createdBy,
          role: "OWNER",
        },
        include: { workspace: true },
      });

      return membership;
    });
  },

  listMembers(workspaceId: string) {
    return prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: { user: { select: userSelect } },
      orderBy: { createdAt: "asc" },
    });
  },

  findMember(workspaceId: string, userId: string) {
    return prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    });
  },

  countOwners(workspaceId: string) {
    return prisma.workspaceMember.count({ where: { workspaceId, role: "OWNER" } });
  },

  updateMemberRole(workspaceId: string, userId: string, role: MemberRole) {
    return prisma.workspaceMember.update({
      where: { workspaceId_userId: { workspaceId, userId } },
      data: { role },
      include: { user: { select: userSelect } },
    });
  },

  removeMember(workspaceId: string, userId: string) {
    return prisma.workspaceMember.delete({
      where: { workspaceId_userId: { workspaceId, userId } },
    });
  },
};
