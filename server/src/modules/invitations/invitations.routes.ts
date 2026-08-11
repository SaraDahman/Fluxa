import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";

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
  "/:invitationId",
  authenticate,
  validate({
    params: invitationParamsSchema,
  }),
  invitationController.revoke
);

export default router;
