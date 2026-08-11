import type { Request, Response } from "express";

import type { AuthenticatedRequest } from "../auth/types";

import type { CreateInvitationBody } from "./dto/createInvitation.schema";
import type { AcceptInvitationBody } from "./dto/acceptInvitation.schema";
import type { InvitationParams } from "./dto/invitationParams.schema";
import type { InvitationTokenParams } from "./dto/invitationTokenParams.schema";
import type { WorkspaceParams } from "./dto/workspaceParams.schema";

import { invitationService } from "./invitations.service";

export const invitationController = {
  async getByToken(req: Request, res: Response) {
    const { token } = req.params as unknown as InvitationTokenParams;

    const invitation = await invitationService.getInvitationByToken(token);

    res.json({
      success: true,
      data: invitation,
    });
  },

  async create(req: Request & AuthenticatedRequest, res: Response) {
    const { workspaceId } = req.params as unknown as WorkspaceParams;
    const { email, role } = req.body as CreateInvitationBody;

    const invitation = await invitationService.createInvitation({
      workspaceId,
      userId: req.user!.userId,
      email,
      role,
    });

    res.status(201).json({
      success: true,
      message: "Invitation sent successfully",
      data: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        expiresAt: invitation.expiresAt,
      },
    });
  },

  async accept(req: Request & AuthenticatedRequest, res: Response) {
    const { token } = req.body as AcceptInvitationBody;

    const member = await invitationService.acceptInvitation({
      token,
      userId: req.user!.userId,
    });

    res.status(200).json({
      success: true,
      message: "Invitation accepted successfully",
      data: {
        workspaceId: member.workspaceId,
        role: member.role,
      },
    });
  },

  async revoke(req: Request & AuthenticatedRequest, res: Response) {
    const { invitationId } = req.params as unknown as InvitationParams;

    await invitationService.revokeInvitation({
      invitationId,
      userId: req.user!.userId,
    });

    res.status(200).json({
      success: true,
      message: "Invitation revoked successfully",
    });
  },
};
