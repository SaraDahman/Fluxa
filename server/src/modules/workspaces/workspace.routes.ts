import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";

import { workspaceController } from "./workspace.controller";
import { createWorkspaceSchema } from "./dto/create-workspace.schema";
import { workspaceParamsSchema } from "./dto/workspace-params.schema";

const router = Router();

router.post(
  "/",
  authenticate,
  validate({ body: createWorkspaceSchema }),
  workspaceController.createWorkspace
);

router.get("/", authenticate, workspaceController.listWorkspaces);

router.get(
  "/:workspaceId",
  authenticate,
  validate({ params: workspaceParamsSchema }),
  workspaceController.getWorkspace
);

export default router;
