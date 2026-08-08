import type { MemberRole } from "../../../generated/prisma/enums";
import type { WorkspaceModel } from "../../../generated/prisma/models/Workspace";

import { ApiError } from "../../utils/api-error";

import { workspaceRepository } from "./workspace.repository";

import type { CreateWorkspaceBody } from "./dto/create-workspace.schema";

type WorkspaceWithRole = {
  workspace: WorkspaceModel;
  role: MemberRole;
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
};
