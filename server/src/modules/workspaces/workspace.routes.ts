import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";

import { workspaceController } from "./workspace.controller";
import { createWorkspaceSchema } from "./dto/create-workspace.schema";
import { memberParamsSchema } from "./dto/member-params.schema";
import { updateMemberRoleSchema } from "./dto/update-member-role.schema";
import { workspaceParamsSchema } from "./dto/workspace-params.schema";
import { requireWorkspaceRole } from "./middleware/require-workspace-role.middleware";

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

router.get(
  "/:workspaceId/members",
  authenticate,
  validate({ params: workspaceParamsSchema }),
  requireWorkspaceRole("MEMBER"),
  workspaceController.listMembers
);

router.patch(
  "/:workspaceId/members/:userId",
  authenticate,
  validate({ params: memberParamsSchema, body: updateMemberRoleSchema }),
  requireWorkspaceRole("ADMIN"),
  workspaceController.updateMemberRole
);

router.delete(
  "/:workspaceId/members/:userId",
  authenticate,
  validate({ params: memberParamsSchema }),
  requireWorkspaceRole("MEMBER"),
  workspaceController.removeMember
);

export default router;
