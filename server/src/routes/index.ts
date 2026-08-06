import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";

const router = Router();

router.get("/health", (_, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
  });
});

router.use("/auth", authRoutes);

export default router;
