import crypto from "node:crypto";
import { Resend } from "resend";

import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";
import { ApiError } from "../../utils/api-error";

import { invitationRepository } from "./invitations.repository";

import type { InvitationRole } from "./types";

const resend = new Resend(env.RESEND_API_KEY);

const INVITATION_EXPIRATION_DAYS = 7;

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

function getExpirationDate() {
  const expiresAt = new Date();

  expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRATION_DAYS);

  return expiresAt;
}

export const invitationService = {
  async createInvitation({
    workspaceId,
    userId,
    email,
    role,
  }: {
    workspaceId: string;
    userId: string;
    email: string;
    role: InvitationRole;
  }) {
    const normalizedEmail = email.trim().toLowerCase();

    // Find workspace
    const workspace = await prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
    });

    if (!workspace) {
      throw new ApiError(404, "Workspace not found");
    }

    // Find inviter's membership
    const inviter = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
      include: {
        user: true,
      },
    });

    if (!inviter) {
      throw new ApiError(403, "You are not a member of this workspace");
    }

    // Only OWNER and ADMIN can invite
    if (inviter.role !== "OWNER" && inviter.role !== "ADMIN") {
      throw new ApiError(403, "You don't have permission to invite members");
    }

    // Check if user is already a member
    const existingMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        user: {
          email: normalizedEmail,
        },
      },
    });

    if (existingMember) {
      throw new ApiError(409, "This user is already a member of the workspace");
    }

    // Check existing invitation
    const existingInvitation = await invitationRepository.findByWorkspaceAndEmail(
      workspaceId,
      normalizedEmail
    );

    if (existingInvitation?.status === "PENDING") {
      throw new ApiError(409, "An invitation is already pending for this email");
    }

    const token = generateToken();
    const expiresAt = getExpirationDate();

    // Reuse old invitation record if it exists
    const invitation = existingInvitation
      ? await invitationRepository.update(existingInvitation.id, {
          token,
          role,
          expiresAt,
        })
      : await invitationRepository.create({
          workspaceId,
          email: normalizedEmail,
          token,
          role,
          invitedById: userId,
          expiresAt,
        });

    const invitationUrl = `${env.CLIENT_URL}/invitations/accept?token=${token}`;

    // Send email
    const { error } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: normalizedEmail,
      subject: `You've been invited to ${workspace.name}`,
      html: `
        <div
          style="
            max-width: 600px;
            margin: 0 auto;
            font-family: Arial, sans-serif;
          "
        >
          <h1>You've been invited to ${workspace.name}</h1>

          <p>
            <strong>${inviter.user.username}</strong>
            has invited you to join
            <strong>${workspace.name}</strong> on Fluxa.
          </p>

          <p>
            Your role will be:
            <strong>${role}</strong>
          </p>

          <a
            href="${invitationUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #000;
              color: #fff;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Accept invitation
          </a>

          <p style="margin-top: 24px; color: #666;">
            This invitation expires in 7 days.
          </p>

          <p style="color: #666;">
            If you weren't expecting this invitation,
            you can safely ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      throw new ApiError(500, "Failed to send invitation email");
    }

    return invitation;
  },

  async getInvitationByToken(token: string) {
    const invitation = await invitationRepository.findByToken(token);

    if (!invitation) {
      throw new ApiError(404, "Invitation not found");
    }

    return invitation;
  },

  async acceptInvitation({ token, userId }: { token: string; userId: string }) {
    const invitation = await invitationRepository.findByToken(token);

    if (!invitation) {
      throw new ApiError(404, "Invitation not found");
    }

    if (invitation.status !== "PENDING") {
      throw new ApiError(400, "This invitation is no longer valid");
    }

    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      await invitationRepository.expire(invitation.id);

      throw new ApiError(400, "This invitation has expired");
    }

    // Get authenticated user
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Invitation must belong to authenticated user's email
    if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      throw new ApiError(403, "This invitation was sent to a different email address");
    }

    // Check existing membership
    const existingMember = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: invitation.workspaceId,
          userId,
        },
      },
    });

    if (existingMember) {
      throw new ApiError(409, "You are already a member of this workspace");
    }

    // Create member + accept invitation atomically
    const member = await prisma.$transaction(async (tx) => {
      const newMember = await tx.workspaceMember.create({
        data: {
          workspaceId: invitation.workspaceId,
          userId,
          role: invitation.role,
        },
      });

      await tx.workspaceInvitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          status: "ACCEPTED",
        },
      });

      return newMember;
    });

    return member;
  },

  async revokeInvitation({ invitationId, userId }: { invitationId: string; userId: string }) {
    const invitation = await prisma.workspaceInvitation.findUnique({
      where: {
        id: invitationId,
      },
    });

    if (!invitation) {
      throw new ApiError(404, "Invitation not found");
    }

    const member = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: invitation.workspaceId,
          userId,
        },
      },
    });

    if (!member) {
      throw new ApiError(403, "You are not a member of this workspace");
    }

    if (member.role !== "OWNER" && member.role !== "ADMIN") {
      throw new ApiError(403, "You don't have permission to revoke invitations");
    }

    if (invitation.status !== "PENDING") {
      throw new ApiError(400, "Only pending invitations can be revoked");
    }

    return invitationRepository.revoke(invitationId);
  },
};
