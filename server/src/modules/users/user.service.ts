import type { UserModel } from "../../../generated/prisma/models/User";

import { ApiError } from "../../utils/api-error";

import { userRepository } from "./user.repository";

import type { UpdateProfileBody } from "./dto/update-profile.schema";

type PublicUser = Omit<UserModel, "password">;

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

    const updateData: { username: string; title?: string | null; avatar?: string | null } = {
      username: data.username,
    };

    if (data.title !== undefined) {
      updateData.title = data.title;
    }

    if (data.avatar !== undefined) {
      updateData.avatar = data.avatar;
    }

    const updated = await userRepository.updateProfile(userId, {
      ...updateData,
      profileComplete: true,
    });

    return toPublicUser(updated);
  },
};
