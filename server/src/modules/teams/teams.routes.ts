import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { requireWorkspaceRole } from "../workspaces/middleware/require-workspace-role.middleware";

import { teamController } from "./teams.controller";
import { createTeamSchema } from "./dto/create-team.schema";
import { teamParamsSchema } from "./dto/team-params.schema";
import { workspaceParamsSchema } from "./dto/workspace-params.schema";

const router = Router({ mergeParams: true });

router.post(
  "/:workspaceId/teams",
  authenticate,
  validate({ params: workspaceParamsSchema, body: createTeamSchema }),
  requireWorkspaceRole("MEMBER"),
  teamController.createTeam
);

router.get(
  "/:workspaceId/teams",
  authenticate,
  validate({ params: workspaceParamsSchema }),
  requireWorkspaceRole("MEMBER"),
  teamController.listTeams
);

router.get(
  "/:workspaceId/teams/:teamId",
  authenticate,
  validate({ params: teamParamsSchema }),
  requireWorkspaceRole("MEMBER"),
  teamController.getTeam
);

export default router;
