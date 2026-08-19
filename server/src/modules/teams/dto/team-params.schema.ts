import { z } from "zod";

export const teamParamsSchema = z.object({
  workspaceId: z.uuid("Invalid workspace ID"),
  teamId: z.uuid("Invalid team ID"),
});

export type TeamParams = z.infer<typeof teamParamsSchema>;
