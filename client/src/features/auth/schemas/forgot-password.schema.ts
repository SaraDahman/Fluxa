import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address").trim(),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
