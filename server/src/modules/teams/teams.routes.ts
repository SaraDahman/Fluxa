import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { requireWorkspacePermission } from "../../middleware/require-permission.middleware";
import { validate } from "../../middleware/validate.middleware";
import { PERMISSIONS } from "../../permissions/constants";

import { teamController } from "./teams.controller";
import { createTeamSchema } from "./dto/create-team.schema";
import { paginationSchema } from "./dto/pagination.schema";
import { teamParamsSchema } from "./dto/team-params.schema";
import { updateTeamSchema } from "./dto/update-team.schema";
import { workspaceParamsSchema } from "./dto/workspace-params.schema";

const router = Router({ mergeParams: true });

router.post(
  "/:workspaceId/teams",
  authenticate,
  validate({ params: workspaceParamsSchema, body: createTeamSchema }),
  requireWorkspacePermission(PERMISSIONS.TEAM_CREATE),
  teamController.createTeam
);

router.get(
  "/:workspaceId/teams",
  authenticate,
  validate({ params: workspaceParamsSchema, query: paginationSchema }),
  requireWorkspacePermission(PERMISSIONS.TEAM_VIEW),
  teamController.listTeams
);

router.get(
  "/:workspaceId/teams/:teamId",
  authenticate,
  validate({ params: teamParamsSchema }),
  requireWorkspacePermission(PERMISSIONS.TEAM_ACCESS),
  teamController.getTeam
);

router.patch(
  "/:workspaceId/teams/:teamId",
  authenticate,
  validate({ params: teamParamsSchema, body: updateTeamSchema }),
  requireWorkspacePermission(PERMISSIONS.TEAM_UPDATE),
  teamController.updateTeam
);

router.delete(
  "/:workspaceId/teams/:teamId",
  authenticate,
  validate({ params: teamParamsSchema }),
  requireWorkspacePermission(PERMISSIONS.TEAM_DELETE),
  teamController.deleteTeam
);

export default router;
