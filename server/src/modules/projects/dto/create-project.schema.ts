import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Project name is required")
    .max(100, "Project name cannot exceed 100 characters"),
  key: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{2,10}$/, "Project key must be 2–10 uppercase letters or numbers"),
  description: z.string().trim().max(500, "Description cannot exceed 500 characters").optional(),
  teamId: z.uuid("Invalid team ID").optional(),
  addCreatorAsMember: z.boolean().optional(),
});

export type CreateProjectBody = z.infer<typeof createProjectSchema>;
