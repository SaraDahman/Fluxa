import { z } from "zod";

export const acceptInvitationSchema = z.object({
  token: z.string().min(1),
});

export type AcceptInvitationBody = z.infer<typeof acceptInvitationSchema>;
