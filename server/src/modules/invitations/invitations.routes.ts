import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { requireWorkspacePermission } from "../../middleware/require-permission.middleware";
import { validate } from "../../middleware/validate.middleware";
import { PERMISSIONS } from "../../permissions/constants";

import { invitationController } from "./invitations.controller";

import { acceptInvitationSchema } from "./dto/acceptInvitation.schema";
import { createInvitationSchema } from "./dto/createInvitation.schema";
import { invitationParamsSchema } from "./dto/invitationParams.schema";
import { invitationTokenParamsSchema } from "./dto/invitationTokenParams.schema";
import { workspaceParamsSchema } from "./dto/workspaceParams.schema";

const router = Router();

router.get(
  "/:token",
  validate({ params: invitationTokenParamsSchema }),
  invitationController.getByToken
);

router.post(
  "/workspaces/:workspaceId",
  authenticate,
  validate({
    params: workspaceParamsSchema,
    body: createInvitationSchema,
  }),
  requireWorkspacePermission(PERMISSIONS.WORKSPACE_INVITE),
  invitationController.create
);

router.post(
  "/accept",
  authenticate,
  validate({
    body: acceptInvitationSchema,
  }),
  invitationController.accept
);

router.delete(
  "/workspaces/:workspaceId/:invitationId",
  authenticate,
  validate({
    params: invitationParamsSchema,
  }),
  requireWorkspacePermission(PERMISSIONS.WORKSPACE_INVITE),
  invitationController.revoke
);

export default router;
