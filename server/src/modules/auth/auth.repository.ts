import { prisma } from "../../lib/prisma";

export const authRepository = {
  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  },

  createUser(data: { username: string; email: string; password: string }) {
    return prisma.user.create({ data });
  },
};
