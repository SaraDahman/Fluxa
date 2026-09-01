import { ApiError } from "../../utils/api-error";

import { teamRepository } from "./teams.repository";

import type { CreateTeamBody } from "./dto/create-team.schema";
import type { PaginatedResponse, PaginationQuery } from "./dto/pagination.schema";
import type { TeamWithMembers, TeamSummary } from "./types";

export const teamService = {
  async createTeam(workspaceId: string, data: CreateTeamBody): Promise<TeamWithMembers> {
    const existing = await teamRepository.findByWorkspaceAndName(workspaceId, data.name);

    if (existing) {
      throw new ApiError(409, "A team with this name already exists in this workspace");
    }

    const team = await teamRepository.create({
      ...data,
      workspaceId,
    });

    return {
      ...team,
      members: [],
    };
  },

  async listTeams(
    workspaceId: string,
    pagination: PaginationQuery
  ): Promise<PaginatedResponse<TeamSummary>> {
    const { offset, limit } = pagination;

    const [items, total] = await Promise.all([
      teamRepository.listByWorkspace(workspaceId, offset, limit),
      teamRepository.countByWorkspace(workspaceId),
    ]);

    return { items, total, offset, limit };
  },

  async getTeam(teamId: string, workspaceId: string): Promise<TeamWithMembers> {
    const team = await teamRepository.findWithMembers(teamId, workspaceId);

    if (!team) {
      throw new ApiError(404, "Team not found");
    }

    return team;
  },
};
