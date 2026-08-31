import { z } from "zod";

export const invitationParamsSchema = z.object({
  workspaceId: z.string().uuid(),
  invitationId: z.string().uuid(),
});

export type InvitationParams = z.infer<typeof invitationParamsSchema>;
