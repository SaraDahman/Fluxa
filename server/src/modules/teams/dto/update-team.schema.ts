import { z } from "zod";

export const updateTeamSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Team name is required")
      .max(100, "Team name cannot exceed 100 characters")
      .optional(),
    description: z.string().trim().max(500, "Description cannot exceed 500 characters").optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: "At least one field (name or description) must be provided",
  });

export type UpdateTeamBody = z.infer<typeof updateTeamSchema>;
