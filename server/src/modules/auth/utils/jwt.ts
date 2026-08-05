import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

import { env } from "../../../config/env";

import { ApiError } from "../../../utils/api-error";

import type { AuthTokenPayload } from "../types";

function createSignOptions(expiresIn: string): SignOptions {
  return {
    expiresIn: expiresIn as NonNullable<SignOptions["expiresIn"]>,
  };
}

export function generateAccessToken(payload: AuthTokenPayload): string {
  return jwt.sign(
    { ...payload, type: "access" },
    env.JWT_ACCESS_SECRET,
    createSignOptions(env.ACCESS_TOKEN_EXPIRES_IN)
  );
}

export function generateRefreshToken(payload: AuthTokenPayload): string {
  return jwt.sign(
    { ...payload, type: "refresh" },
    env.JWT_REFRESH_SECRET,
    createSignOptions(env.REFRESH_TOKEN_EXPIRES_IN)
  );
}

export function verifyAccessToken(token: string): AuthTokenPayload {
  try {
    return toAuthTokenPayload(jwt.verify(token, env.JWT_ACCESS_SECRET));
  } catch {
    throw new ApiError(401, "Invalid or expired access token");
  }
}

export function verifyRefreshToken(token: string): AuthTokenPayload {
  try {
    return toAuthTokenPayload(jwt.verify(token, env.JWT_REFRESH_SECRET));
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
}

function toAuthTokenPayload(decoded: string | JwtPayload): AuthTokenPayload {
  if (typeof decoded === "object" && decoded !== null) {
    const { userId, email, username } = decoded as Partial<AuthTokenPayload>;

    if (userId && email && username) {
      return { userId, email, username };
    }
  }

  throw new ApiError(401, "Invalid token payload");
}
