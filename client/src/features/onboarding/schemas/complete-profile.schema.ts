import { z } from "zod";

export const completeProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username must be at most 30 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  title: z.string().trim().max(60, "Title must be at most 60 characters").optional(),
});

export type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;
