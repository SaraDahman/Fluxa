import type { WorkspaceRole } from "../../../generated/prisma/enums";
import type { WorkspaceModel } from "../../../generated/prisma/models/Workspace";

import { ApiError } from "../../utils/api-error";

import { workspaceRepository } from "./workspace.repository";

import type { CreateWorkspaceBody } from "./dto/create-workspace.schema";
import type { WorkspaceMemberWithUser, WorkspaceWithRole } from "./types";

function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return slug || "workspace";
}

async function resolveUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let suffix = 2;

  while (await workspaceRepository.findBySlug(slug)) {
    slug = `${baseSlug}-${suffix}`.slice(0, 60);
    suffix += 1;
  }

  return slug;
}

export const workspaceService = {
  async createWorkspace(userId: string, data: CreateWorkspaceBody): Promise<WorkspaceWithRole> {
    const nameTaken = await workspaceRepository.findByOwnerAndName(userId, data.name);

    if (nameTaken) {
      throw new ApiError(409, "You already have a workspace with this name");
    }

    const baseSlug = slugify(data.name);
    const slug = await resolveUniqueSlug(baseSlug);

    const membership = await workspaceRepository.createWorkspaceWithOwner({
      ...data,
      slug,
      createdBy: userId,
    });

    return {
      workspace: membership.workspace,
      role: membership.role,
    };
  },

  async listWorkspaces(userId: string): Promise<WorkspaceWithRole[]> {
    const memberships = await workspaceRepository.listMembershipsByUser(userId);

    return memberships.map((membership) => ({
      workspace: membership.workspace,
      role: membership.role,
    }));
  },

  async getWorkspace(workspaceId: string): Promise<WorkspaceModel> {
    const workspace = await workspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new ApiError(404, "Workspace not found");
    }

    return workspace;
  },

  async listMembers(workspaceId: string): Promise<WorkspaceMemberWithUser[]> {
    return workspaceRepository.listMembers(workspaceId);
  },

  async updateMemberRole(
    userId: string,
    workspaceId: string,
    targetUserId: string,
    role: WorkspaceRole
  ): Promise<WorkspaceMemberWithUser> {
    const target = await workspaceRepository.findMember(workspaceId, targetUserId);

    if (!target) {
      throw new ApiError(404, "Member not found");
    }

    if (target.userId === userId) {
      throw new ApiError(400, "You cannot change your own role");
    }

    if (target.role === "OWNER" && role !== "OWNER") {
      const ownerCount = await workspaceRepository.countOwners(workspaceId);

      if (ownerCount <= 1) {
        throw new ApiError(400, "You cannot demote the last owner of the workspace");
      }
    }

    const member = await workspaceRepository.updateMemberRole(workspaceId, targetUserId, role);

    return member;
  },

  async removeMember(workspaceId: string, targetUserId: string): Promise<void> {
    const target = await workspaceRepository.findMember(workspaceId, targetUserId);

    if (!target) {
      throw new ApiError(404, "Member not found");
    }

    if (target.role === "OWNER") {
      const ownerCount = await workspaceRepository.countOwners(workspaceId);

      if (ownerCount <= 1) {
        throw new ApiError(400, "You cannot remove the last owner of the workspace");
      }
    }

    await workspaceRepository.removeMember(workspaceId, targetUserId);
  },

  async leaveWorkspace(userId: string, workspaceId: string): Promise<void> {
    const membership = await workspaceRepository.findMember(workspaceId, userId);

    if (!membership) {
      throw new ApiError(404, "Workspace not found");
    }

    if (membership.role === "OWNER") {
      const ownerCount = await workspaceRepository.countOwners(workspaceId);

      if (ownerCount <= 1) {
        throw new ApiError(400, "You cannot leave the workspace as the last owner");
      }
    }

    await workspaceRepository.removeMember(workspaceId, userId);
  },
};
