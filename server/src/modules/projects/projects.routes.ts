import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { requireWorkspacePermission } from "../../middleware/require-permission.middleware";
import { validate } from "../../middleware/validate.middleware";
import { PERMISSIONS } from "../../permissions/constants";

import { projectController } from "./projects.controller";
import { createProjectSchema } from "./dto/create-project.schema";
import { workspaceParamsSchema } from "./dto/workspace-params.schema";

const router = Router({ mergeParams: true });

router.post(
  "/:workspaceId/projects",
  authenticate,
  validate({ params: workspaceParamsSchema, body: createProjectSchema }),
  requireWorkspacePermission(PERMISSIONS.PROJECT_CREATE),
  projectController.createProject
);

export default router;
