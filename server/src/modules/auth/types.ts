import type { Request } from "express";

export interface AuthTokenPayload {
  userId: string;
  email: string;
  username: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}
