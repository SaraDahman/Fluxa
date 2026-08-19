import { ApiError } from "../../utils/api-error";

import { teamRepository } from "./teams.repository";

import type { CreateTeamBody } from "./dto/create-team.schema";
import type { TeamActor, TeamWithMembers } from "./types";

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

  async listTeams(workspaceId: string, actor: TeamActor) {
    if (actor.role === "OWNER") {
      return teamRepository.listByWorkspace(workspaceId);
    }

    return teamRepository.listByWorkspaceForUser(workspaceId, actor.userId);
  },

  async getTeam(teamId: string): Promise<TeamWithMembers> {
    const team = await teamRepository.findWithMembers(teamId);

    if (!team) {
      throw new ApiError(404, "Team not found");
    }

    return team;
  },
};
