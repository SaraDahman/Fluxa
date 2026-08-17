import { z } from "zod";

export const inviteMemberSchema = z.object({
  email: z.email("Please enter a valid email address").trim().toLowerCase(),
  role: z.enum(["MEMBER", "ADMIN"], {
    message: "Please select a role",
  }),
});

export type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>;
