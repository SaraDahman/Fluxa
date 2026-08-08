import type { MemberRole } from "../../../generated/prisma/enums";
import type { WorkspaceModel } from "../../../generated/prisma/models/Workspace";

import { ApiError } from "../../utils/api-error";

import { workspaceRepository } from "./workspace.repository";

import type { CreateWorkspaceBody } from "./dto/create-workspace.schema";

type WorkspaceWithRole = {
  workspace: WorkspaceModel;
  role: MemberRole;
};

type MemberActor = {
  userId: string;
  role: MemberRole;
};

type WorkspaceMemberWithUser = {
  id: string;
  workspaceId: string;
  userId: string;
  role: MemberRole;
  createdAt: Date;
  user: {
    id: string;
    email: string;
    username: string | null;
    title: string | null;
    avatar: string | null;
  };
};

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

    const baseSlug = data.slug ?? slugify(data.name);
    const slug = await resolveUniqueSlug(baseSlug);

    const membership = await workspaceRepository.createWorkspaceWithOwner({
      name: data.name,
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

  async getWorkspace(userId: string, workspaceId: string): Promise<WorkspaceWithRole> {
    const membership = await workspaceRepository.findMembership(workspaceId, userId);

    if (!membership) {
      throw new ApiError(404, "Workspace not found");
    }

    return {
      workspace: membership.workspace,
      role: membership.role,
    };
  },

  async listMembers(workspaceId: string): Promise<WorkspaceMemberWithUser[]> {
    const members = await workspaceRepository.listMembers(workspaceId);

    return members.map((member) => ({
      id: member.id,
      workspaceId: member.workspaceId,
      userId: member.userId,
      role: member.role,
      createdAt: member.createdAt,
      user: member.user,
    }));
  },

  async updateMemberRole(
    actor: MemberActor,
    workspaceId: string,
    targetUserId: string,
    role: MemberRole
  ): Promise<WorkspaceMemberWithUser> {
    const target = await workspaceRepository.findMember(workspaceId, targetUserId);

    if (!target) {
      throw new ApiError(404, "Member not found");
    }

    if (target.userId === actor.userId) {
      throw new ApiError(400, "You cannot change your own role");
    }

    if (actor.role === "ADMIN" && (target.role === "OWNER" || role === "OWNER")) {
      throw new ApiError(403, "Only the workspace owner can manage owner roles");
    }

    if (target.role === "OWNER" && role !== "OWNER") {
      const ownerCount = await workspaceRepository.countOwners(workspaceId);

      if (ownerCount <= 1) {
        throw new ApiError(400, "You cannot demote the last owner of the workspace");
      }
    }

    const member = await workspaceRepository.updateMemberRole(workspaceId, targetUserId, role);

    return {
      id: member.id,
      workspaceId: member.workspaceId,
      userId: member.userId,
      role: member.role,
      createdAt: member.createdAt,
      user: member.user,
    };
  },

  async removeMember(actor: MemberActor, workspaceId: string, targetUserId: string): Promise<void> {
    const target = await workspaceRepository.findMember(workspaceId, targetUserId);

    if (!target) {
      throw new ApiError(404, "Member not found");
    }

    const isSelf = target.userId === actor.userId;

    if (isSelf) {
      if (target.role === "OWNER") {
        const ownerCount = await workspaceRepository.countOwners(workspaceId);

        if (ownerCount <= 1) {
          throw new ApiError(400, "You cannot leave the workspace as the last owner");
        }
      }
    } else {
      if (actor.role === "MEMBER") {
        throw new ApiError(403, "You do not have permission to remove other members");
      }

      if (target.role === "OWNER") {
        if (actor.role !== "OWNER") {
          throw new ApiError(403, "Only the workspace owner can remove the owner");
        }

        const ownerCount = await workspaceRepository.countOwners(workspaceId);

        if (ownerCount <= 1) {
          throw new ApiError(400, "You cannot remove the last owner of the workspace");
        }
      } else if (target.role === "ADMIN" && actor.role === "ADMIN") {
        throw new ApiError(403, "Only the workspace owner can remove admins");
      }
    }

    await workspaceRepository.removeMember(workspaceId, targetUserId);
  },
};
