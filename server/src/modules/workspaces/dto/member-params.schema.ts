import { z } from "zod";

export const memberParamsSchema = z.object({
  workspaceId: z.uuid("Invalid workspace id"),
  userId: z.uuid("Invalid user id"),
});

export type MemberParams = z.infer<typeof memberParamsSchema>;
