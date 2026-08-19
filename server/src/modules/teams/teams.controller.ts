import type { Response } from "express";

import type { WorkspaceRequest } from "../workspaces/types";

import { teamService } from "./teams.service";

import type { CreateTeamBody } from "./dto/create-team.schema";
import type { TeamParams } from "./dto/team-params.schema";
import type { WorkspaceParams } from "./dto/workspace-params.schema";

export const teamController = {
  async createTeam(req: WorkspaceRequest, res: Response) {
    const { workspaceId } = req.params as WorkspaceParams;
    const body = req.body as CreateTeamBody;

    const team = await teamService.createTeam(req.user!.userId, workspaceId, body);

    res.status(201).json({
      success: true,
      message: "Team created successfully",
      data: team,
    });
  },

  async listTeams(req: WorkspaceRequest, res: Response) {
    const { workspaceId } = req.params as WorkspaceParams;

    const teams = await teamService.listTeams(workspaceId, {
      userId: req.user!.userId,
      role: req.membership!.role,
    });

    res.json({
      success: true,
      data: teams,
    });
  },

  async getTeam(req: WorkspaceRequest, res: Response) {
    const { teamId } = req.params as TeamParams;

    const team = await teamService.getTeam(teamId);

    res.json({
      success: true,
      data: team,
    });
  },
};
