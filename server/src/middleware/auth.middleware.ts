import type { NextFunction, Response } from "express";

import { ApiError } from "../utils/api-error";

import type { AuthenticatedRequest } from "../modules/auth/types";

import { verifyAccessToken } from "../modules/auth/utils/jwt";

export function authenticate(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
    next(new ApiError(401, "Authentication required"));
    return;
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    req.user = verifyAccessToken(token);
  } catch (error) {
    next(error);
    return;
  }

  next();
}
