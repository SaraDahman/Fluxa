import type { UserModel } from "../../../generated/prisma/models/User";

import { ApiError } from "../../utils/api-error";

import { userRepository } from "./user.repository";

import type { UpdateProfileBody } from "./dto/update-profile.schema";

import type { PublicUser } from "./types";

function toPublicUser(user: UserModel): PublicUser {
  const { password: _password, ...publicUser } = user;

  return publicUser;
}

export const userService = {
  async updateProfile(userId: string, data: UpdateProfileBody): Promise<PublicUser> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (data.username !== user.username) {
      const usernameTaken = await userRepository.findByUsername(data.username);

      if (usernameTaken && usernameTaken.id !== userId) {
        throw new ApiError(409, "Username is already taken");
      }
    }

    const updated = await userRepository.updateProfile(userId, {
      ...data,
      profileComplete: true,
    });

    return toPublicUser(updated);
  },
};
