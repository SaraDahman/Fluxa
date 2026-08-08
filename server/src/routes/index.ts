import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import userRoutes from "../modules/users/user.routes";
import workspaceRoutes from "../modules/workspaces/workspace.routes";

const router = Router();

router.get("/health", (_, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
  });
});

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.use("/workspaces", workspaceRoutes);

export default router;
