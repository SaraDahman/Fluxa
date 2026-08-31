import { z } from "zod";

import { WorkspaceRole } from "../../../../generated/prisma/enums";

export const updateMemberRoleSchema = z.object({
  role: z.nativeEnum(WorkspaceRole),
});

export type UpdateMemberRoleBody = z.infer<typeof updateMemberRoleSchema>;
