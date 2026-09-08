import { z } from "zod";

export const workspaceParamsSchema = z.object({
  workspaceId: z.uuid("Invalid workspace ID"),
});

export type WorkspaceParams = z.infer<typeof workspaceParamsSchema>;
