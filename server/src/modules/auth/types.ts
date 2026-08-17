import type { Request } from "express";
import type { UserModel } from "../../../generated/prisma/models/User";

export interface AuthTokenPayload {
  userId: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

export type PublicUser = Omit<UserModel, "password">;

export type AuthResponse = {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
};
