import { z } from "zod";

export const workspaceParamsSchema = z.object({
  workspaceId: z.string().uuid(),
});

export type WorkspaceParams = z.infer<typeof workspaceParamsSchema>;
