import { Badge } from "@/components/ui/badge";

import type { WorkspaceRole } from "@/features/workspaces/types";

import { formatRole } from "../lib/format-role";

interface InvitationInfoProps {
  workspaceName: string;
  role: WorkspaceRole;
}

export function InvitationInfo({ workspaceName, role }: InvitationInfoProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border px-4 py-3">
      <div>
        <p className="text-xs font-medium text-muted-foreground">Workspace</p>
        <p className="font-medium">{workspaceName}</p>
      </div>

      <Badge variant="secondary">{formatRole(role)}</Badge>
    </div>
  );
}
