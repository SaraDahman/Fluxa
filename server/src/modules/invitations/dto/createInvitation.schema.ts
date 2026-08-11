import { z } from "zod";

export const createInvitationSchema = z.object({
  email: z.email(),
  role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
});

export type CreateInvitationBody = z.infer<typeof createInvitationSchema>;
