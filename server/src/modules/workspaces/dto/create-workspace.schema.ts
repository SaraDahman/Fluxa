import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Workspace name is required")
    .max(60, "Workspace name cannot exceed 60 characters"),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Please select a valid color")
    .optional(),
});

export type CreateWorkspaceBody = z.infer<typeof createWorkspaceSchema>;
