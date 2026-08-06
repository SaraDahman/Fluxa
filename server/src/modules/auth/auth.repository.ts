import { prisma } from "../../lib/prisma";

export const authRepository = {
  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  createUser(data: { email: string; password: string }) {
    return prisma.user.create({ data });
  },
};
