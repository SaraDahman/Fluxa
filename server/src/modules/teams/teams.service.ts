import { ApiError } from "../../utils/api-error";

import { teamRepository } from "./teams.repository";

import type { CreateTeamBody } from "./dto/create-team.schema";
import type { PaginatedResponse, PaginationQuery } from "./dto/pagination.schema";
import type { TeamActor, TeamWithMembers, TeamSummary } from "./types";

export const teamService = {
  async createTeam(
    userId: string,
    workspaceId: string,
    data: CreateTeamBody
  ): Promise<TeamWithMembers> {
    const existing = await teamRepository.findByWorkspaceAndName(workspaceId, data.name);

    if (existing) {
      throw new ApiError(409, "A team with this name already exists in this workspace");
    }

    const { team, member } = await teamRepository.createWithMember({
      ...data,
      workspaceId,
      userId,
    });

    return {
      ...team,
      members: [member],
    };
  },

  async listTeams(
    workspaceId: string,
    actor: TeamActor,
    pagination: PaginationQuery
  ): Promise<PaginatedResponse<TeamSummary>> {
    const { offset, limit } = pagination;
    const isOwner = actor.role === "OWNER";

    const [items, total] = await Promise.all([
      isOwner
        ? teamRepository.listByWorkspace(workspaceId, offset, limit)
        : teamRepository.listByWorkspaceForUser(workspaceId, actor.userId, offset, limit),
      isOwner
        ? teamRepository.countByWorkspace(workspaceId)
        : teamRepository.countByWorkspaceForUser(workspaceId, actor.userId),
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
