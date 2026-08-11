import { z } from "zod";

export const invitationTokenParamsSchema = z.object({
  token: z.string().min(1),
});

export type InvitationTokenParams = z.infer<typeof invitationTokenParamsSchema>;
