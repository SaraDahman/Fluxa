import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Workspace name is required")
    .max(50, "Workspace name must be at most 50 characters"),
});

export type CreateWorkspaceFormValues = z.infer<typeof createWorkspaceSchema>;
