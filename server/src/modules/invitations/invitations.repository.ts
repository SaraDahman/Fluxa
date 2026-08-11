import { prisma } from "../../lib/prisma";

export const invitationRepository = {
  findByToken(token: string) {
    return prisma.workspaceInvitation.findUnique({
      where: { token },
      include: {
        workspace: true,
        invitedBy: true,
      },
    });
  },

  findByWorkspaceAndEmail(workspaceId: string, email: string) {
    return prisma.workspaceInvitation.findUnique({
      where: {
        workspaceId_email: {
          workspaceId,
          email,
        },
      },
    });
  },

  create(data: {
    workspaceId: string;
    email: string;
    token: string;
    role: "ADMIN" | "MEMBER";
    invitedById: string;
    expiresAt: Date;
  }) {
    return prisma.workspaceInvitation.create({
      data,
    });
  },

  update(
    id: string,
    data: {
      token: string;
      role: "ADMIN" | "MEMBER";
      expiresAt: Date;
    }
  ) {
    return prisma.workspaceInvitation.update({
      where: { id },
      data: {
        ...data,
        status: "PENDING",
      },
    });
  },

  accept(id: string) {
    return prisma.workspaceInvitation.update({
      where: { id },
      data: {
        status: "ACCEPTED",
      },
    });
  },

  revoke(id: string) {
    return prisma.workspaceInvitation.update({
      where: { id },
      data: {
        status: "REVOKED",
      },
    });
  },

  expire(id: string) {
    return prisma.workspaceInvitation.update({
      where: { id },
      data: {
        status: "EXPIRED",
      },
    });
  },
};
