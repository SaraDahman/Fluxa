import { z } from "zod";

export const projectParamsSchema = z.object({
  workspaceId: z.uuid("Invalid workspace ID"),
  projectId: z.uuid("Invalid project ID"),
});

export type ProjectParams = z.infer<typeof projectParamsSchema>;
