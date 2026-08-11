import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ErrorAlert } from "@/shared/components/common/ErrorAlert";

import type { WorkspaceRole } from "@/features/workspaces/types";

import { formatRole } from "../lib/format-role";

import { InvitationCard } from "./InvitationCard";
import { InvitationInfo } from "./InvitationInfo";

interface JoinWorkspaceCardProps {
  workspaceName: string;
  role: WorkspaceRole;
  currentUserEmail: string;
  accepting: boolean;
  acceptError: string | null;
  onAccept: () => void;
  onSignOut: () => void;
}

export function JoinWorkspaceCard({
  workspaceName,
  role,
  currentUserEmail,
  accepting,
  acceptError,
  onAccept,
  onSignOut,
}: JoinWorkspaceCardProps) {
  return (
    <InvitationCard
      title={`Join ${workspaceName}`}
      description={`You've been invited to join this workspace as ${formatRole(role)}.`}
    >
      <InvitationInfo workspaceName={workspaceName} role={role} />

      {acceptError && <ErrorAlert title="Unable to accept invitation" message={acceptError} />}

      <Button className="w-full" onClick={onAccept} disabled={accepting}>
        {accepting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Accepting...
          </>
        ) : (
          <>
            Accept invitation
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Signed in as <span className="font-medium text-foreground">{currentUserEmail}</span>
        <span className="mx-2">·</span>
        <button
          type="button"
          onClick={onSignOut}
          className="font-medium text-primary transition-colors hover:text-primary/80"
        >
          Not the right account? Sign out
        </button>
      </p>
    </InvitationCard>
  );
}
