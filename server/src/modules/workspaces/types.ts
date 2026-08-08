import type { WorkspaceMemberModel } from "../../../generated/prisma/models/WorkspaceMember";

import type { AuthenticatedRequest } from "../auth/types";

export interface WorkspaceRequest extends AuthenticatedRequest {
  membership?: WorkspaceMemberModel;
}
