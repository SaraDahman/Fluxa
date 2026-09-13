import { z } from "zod";

export const teamProjectParamsSchema = z.object({
  workspaceId: z.uuid("Invalid workspace ID"),
  teamId: z.uuid("Invalid team ID"),
  projectId: z.uuid("Invalid project ID"),
});

export type TeamProjectParams = z.infer<typeof teamProjectParamsSchema>;
