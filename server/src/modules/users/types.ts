import type { UserModel } from "../../../generated/prisma/models/User";

export type PublicUser = Omit<UserModel, "password">;
