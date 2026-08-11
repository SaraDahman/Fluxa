import { z } from "zod";

export const invitationParamsSchema = z.object({
  invitationId: z.string().uuid(),
});

export type InvitationParams = z.infer<typeof invitationParamsSchema>;
