import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import {
  requireProjectPermission,
  requireWorkspacePermission,
} from "../../middleware/require-permission.middleware";
import { validate } from "../../middleware/validate.middleware";
import { PERMISSIONS } from "../../permissions/constants";

import { projectController } from "./projects.controller";
import { createProjectSchema } from "./dto/create-project.schema";
import { projectParamsSchema } from "./dto/project-params.schema";
import { updateProjectSchema } from "./dto/update-project.schema";
import { workspaceParamsSchema } from "./dto/workspace-params.schema";

const router = Router({ mergeParams: true });

router.post(
  "/:workspaceId/projects",
  authenticate,
  validate({ params: workspaceParamsSchema, body: createProjectSchema }),
  requireWorkspacePermission(PERMISSIONS.PROJECT_CREATE),
  projectController.createProject
);

router.patch(
  "/:workspaceId/projects/:projectId",
  authenticate,
  validate({ params: projectParamsSchema, body: updateProjectSchema }),
  requireProjectPermission(PERMISSIONS.PROJECT_UPDATE),
  projectController.updateProject
);

export default router;
