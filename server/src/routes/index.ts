import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import userRoutes from "../modules/users/user.routes";
import workspaceRoutes from "../modules/workspaces/workspace.routes";
import invitationRoutes from "../modules/invitations/invitations.routes";
import teamRoutes from "../modules/teams/teams.routes";

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

router.use("/workspaces", teamRoutes);

router.use("/invitations", invitationRoutes);
export default router;
