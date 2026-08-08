import type { Response } from "express";

import type { AuthenticatedRequest } from "../auth/types";

import { userService } from "./user.service";

import type { UpdateProfileBody } from "./dto/update-profile.schema";

export const userController = {
  async updateMe(req: AuthenticatedRequest, res: Response) {
    const body = req.body as UpdateProfileBody;

    const user = await userService.updateProfile(req.user!.userId, body);

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  },
};
