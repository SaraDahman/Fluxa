import type { Prisma } from "../../../generated/prisma/client";

import { prisma } from "../../lib/prisma";

export const userRepository = {
  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  },

  updateProfile(userId: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  },
};
