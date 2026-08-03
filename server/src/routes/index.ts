import { Router } from "express";

const router = Router();

router.get("/health", (_, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
  });
});

export default router;
