import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

import type { WorkspaceRole } from "@/features/workspaces/types";

import { InvitationCard } from "./InvitationCard";
import { InvitationInfo } from "./InvitationInfo";

interface CreateAccountCardProps {
  token: string;
  workspaceName: string;
  role: WorkspaceRole;
}

export function CreateAccountCard({ token, workspaceName, role }: CreateAccountCardProps) {
  return (
    <InvitationCard
      title="You've been invited!"
      description={
        <>
          You've been invited to join <strong>{workspaceName}</strong> on Fluxa.
        </>
      }
    >
      <InvitationInfo workspaceName={workspaceName} role={role} />

      <p className="text-sm text-muted-foreground">
        Create an account to accept the invitation. Your email will be pre-filled from the
        invitation.
      </p>

      <Button
        render={<Link to={`/sign-up?token=${encodeURIComponent(token)}`} />}
        className="w-full"
      >
        Create an account
        <ArrowRight className="h-4 w-4" />
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to={`/sign-in?token=${encodeURIComponent(token)}`}
          className="font-medium text-primary transition-colors hover:text-primary/80"
        >
          Sign in
        </Link>
      </p>
    </InvitationCard>
  );
}
