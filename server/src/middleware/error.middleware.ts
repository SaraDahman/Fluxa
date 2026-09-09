import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { Prisma } from "../../generated/prisma/client";

import { ApiError } from "../utils/api-error";

import { logger } from "../config/logger";

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues,
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A record with these values already exists",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    logger.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }

  logger.error(error);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
