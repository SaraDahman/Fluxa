import type { NextFunction, Request, Response } from "express";

import type { AuthenticatedRequest } from "../auth/types";

import type { CreateInvitationBody } from "./dto/createInvitation.schema";
import type { AcceptInvitationBody } from "./dto/acceptInvitation.schema";
import type { InvitationParams } from "./dto/invitationParams.schema";
import type { InvitationTokenParams } from "./dto/invitationTokenParams.schema";
import type { WorkspaceParams } from "./dto/workspaceParams.schema";

import { invitationService } from "./invitations.service";

export const invitationController = {
  async getByToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params as unknown as InvitationTokenParams;

      const invitation = await invitationService.getInvitationByToken(token);

      res.json({
        success: true,
        data: invitation,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request & AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
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
    } catch (error) {
      next(error);
    }
  },

  async accept(req: Request & AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
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
    } catch (error) {
      next(error);
    }
  },

  async revoke(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { workspaceId, invitationId } = req.params as unknown as InvitationParams;

      await invitationService.revokeInvitation(workspaceId, invitationId);

      res.status(200).json({
        success: true,
        message: "Invitation revoked successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
