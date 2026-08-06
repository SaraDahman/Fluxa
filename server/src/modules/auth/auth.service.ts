import type { UserModel } from "../../../generated/prisma/models/User";

import { ApiError } from "../../utils/api-error";

import { authRepository } from "./auth.repository";

import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "./utils/jwt";
import { comparePassword, hashPassword } from "./utils/password";

import type { SignInBody } from "./dto/signIn.schema";
import type { SignUpBody } from "./dto/signUp.schema";

import type { AuthTokenPayload } from "./types";

type PublicUser = Omit<UserModel, "password">;

type AuthResponse = {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
};

function toPublicUser(user: UserModel): PublicUser {
  const { password: _password, ...publicUser } = user;

  return publicUser;
}

function buildAuthResponse(user: UserModel): AuthResponse {
  const payload: AuthTokenPayload = {
    userId: user.id,
    email: user.email,
  };

  return {
    user: toPublicUser(user),
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

export const authService = {
  async signUp(data: SignUpBody): Promise<AuthResponse> {
    const emailExists = await authRepository.findByEmail(data.email);

    if (emailExists) {
      throw new ApiError(409, "An account with this email already exists");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await authRepository.createUser({
      email: data.email,
      password: hashedPassword,
    });

    return buildAuthResponse(user);
  },

  async signIn(data: SignInBody): Promise<AuthResponse> {
    const user = await authRepository.findByEmail(data.email);

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    return buildAuthResponse(user);
  },

  async refresh(refreshToken: string | undefined): Promise<AuthResponse> {
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token is missing");
    }

    const payload = verifyRefreshToken(refreshToken);

    const user = await authRepository.findByEmail(payload.email);

    if (!user) {
      throw new ApiError(401, "User account no longer exists");
    }

    return buildAuthResponse(user);
  },

  async getUserById(userId: string): Promise<PublicUser> {
    const user = await authRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return toPublicUser(user);
  },
};
