import type { NextFunction, Response } from "express";

import type { AuthenticatedRequest } from "../auth/types";

import { teamService } from "./teams.service";

import type { CreateTeamBody } from "./dto/create-team.schema";
import type { PaginationQuery } from "./dto/pagination.schema";
import type { TeamParams } from "./dto/team-params.schema";
import type { UpdateTeamBody } from "./dto/update-team.schema";
import type { WorkspaceParams } from "./dto/workspace-params.schema";

export const teamController = {
  async createTeam(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params as WorkspaceParams;
      const body = req.body as CreateTeamBody;

      const team = await teamService.createTeam(workspaceId, body);

      res.status(201).json({
        success: true,
        message: "Team created successfully",
        data: team,
      });
    } catch (error) {
      next(error);
    }
  },

  async listTeams(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params as WorkspaceParams;
      const { offset, limit } = req.query as unknown as PaginationQuery;

      const result = await teamService.listTeams(workspaceId, { offset, limit });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getTeam(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { workspaceId, teamId } = req.params as TeamParams;

      const team = await teamService.getTeam(teamId, workspaceId);

      res.json({
        success: true,
        data: team,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateTeam(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { workspaceId, teamId } = req.params as TeamParams;
      const body = req.body as UpdateTeamBody;

      const team = await teamService.updateTeam(teamId, workspaceId, body);

      res.json({
        success: true,
        message: "Team updated successfully",
        data: team,
      });
    } catch (error) {
      next(error);
    }
  },
};
