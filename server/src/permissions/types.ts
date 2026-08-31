import type { AuthenticatedRequest } from "../modules/auth/types";

import type { ResolvedAccess } from "./resolve";

// Requests that passed a permission check carry the resolved access,
// so controllers can reuse it instead of querying memberships again.
export interface PermissionRequest extends AuthenticatedRequest {
  access?: ResolvedAccess;
}
