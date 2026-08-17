import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Workspace name is required")
    .max(50, "Workspace name must be at most 50 characters"),
  color: z
    .string()
    .transform((v) => (v === "" ? undefined : v))
    .pipe(
      z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/, "Please select a valid color")
        .optional()
    ),
});

export type CreateWorkspaceFormValues = z.infer<typeof createWorkspaceSchema>;
