import ms from "ms";

import type { Request, Response } from "express";

import { env } from "../../config/env";

import { authService } from "./auth.service";

import type { SignInBody } from "./dto/signIn.schema";
import type { SignUpBody } from "./dto/signUp.schema";
import type { AuthenticatedRequest } from "./types";

const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";

const REFRESH_TOKEN_COOKIE_PATH = "/api/v1/auth";

function durationToMilliseconds(duration: string): number {
  return ms(duration as ms.StringValue) ?? 0;
}

function refreshTokenCookieOptions() {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    path: REFRESH_TOKEN_COOKIE_PATH,
  } as const;
}

function setRefreshTokenCookie(res: Response, refreshToken: string) {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    ...refreshTokenCookieOptions(),
    maxAge: durationToMilliseconds(env.REFRESH_TOKEN_EXPIRES_IN),
  });
}

function clearRefreshTokenCookie(res: Response) {
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, refreshTokenCookieOptions());
}

export const authController = {
  async signUp(req: Request, res: Response) {
    const body = req.body as SignUpBody;

    const { user, accessToken, refreshToken } = await authService.signUp(body);

    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: user,
      accessToken,
    });
  },

  async signIn(req: Request, res: Response) {
    const body = req.body as SignInBody;

    const { user, accessToken, refreshToken } = await authService.signIn(body);

    setRefreshTokenCookie(res, refreshToken);

    res.json({
      success: true,
      message: "Signed in successfully",
      data: user,
      accessToken,
    });
  },

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

    const {
      user,
      accessToken,
      refreshToken: newRefreshToken,
    } = await authService.refresh(refreshToken);

    setRefreshTokenCookie(res, newRefreshToken);

    res.json({
      success: true,
      message: "Tokens refreshed successfully",
      data: user,
      accessToken,
    });
  },

  async logout(_req: Request, res: Response) {
    clearRefreshTokenCookie(res);

    res.json({
      success: true,
      message: "Signed out successfully",
    });
  },

  async getMe(req: AuthenticatedRequest, res: Response) {
    const user = await authService.getUserById(req.user!.userId);

    res.json({
      success: true,
      data: user,
    });
  },
};
