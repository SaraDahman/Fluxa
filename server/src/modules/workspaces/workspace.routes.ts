import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { requireWorkspacePermission } from "../../middleware/require-permission.middleware";
import { validate } from "../../middleware/validate.middleware";
import { PERMISSIONS } from "../../permissions/constants";

import { workspaceController } from "./workspace.controller";
import { createWorkspaceSchema } from "./dto/create-workspace.schema";
import { memberParamsSchema } from "./dto/member-params.schema";
import { updateMemberRoleSchema } from "./dto/update-member-role.schema";
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
  requireWorkspacePermission(PERMISSIONS.WORKSPACE_VIEW),
  workspaceController.getWorkspace
);

router.get(
  "/:workspaceId/members",
  authenticate,
  validate({ params: workspaceParamsSchema }),
  requireWorkspacePermission(PERMISSIONS.WORKSPACE_VIEW),
  workspaceController.listMembers
);

router.patch(
  "/:workspaceId/members/:userId",
  authenticate,
  validate({ params: memberParamsSchema, body: updateMemberRoleSchema }),
  requireWorkspacePermission(PERMISSIONS.WORKSPACE_SET_ROLE),
  workspaceController.updateMemberRole
);

router.delete(
  "/:workspaceId/members/:userId",
  authenticate,
  validate({ params: memberParamsSchema }),
  requireWorkspacePermission(PERMISSIONS.WORKSPACE_SET_ROLE),
  workspaceController.removeMember
);

export default router;
