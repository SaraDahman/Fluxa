import { z } from "zod";

export const signInSchema = z.object({
  email: z.email("Please enter a valid email address").trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean(),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
