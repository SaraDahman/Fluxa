import { prisma } from "../../lib/prisma";

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

  createWorkspaceWithOwner(data: { name: string; slug: string; createdBy: string }) {
    return prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name: data.name,
          slug: data.slug,
          createdBy: data.createdBy,
        },
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
};
