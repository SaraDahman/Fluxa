import { z } from "zod";

export const updateProjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Project name is required")
      .max(100, "Project name cannot exceed 100 characters")
      .optional(),
    description: z.string().trim().max(500, "Description cannot exceed 500 characters").optional(),
    teamId: z.uuid("Invalid team ID").nullable().optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined || data.description !== undefined || data.teamId !== undefined,
    {
      message: "At least one field (name, description, or teamId) must be provided",
    }
  );

export type UpdateProjectBody = z.infer<typeof updateProjectSchema>;
