import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import { InvitationCard } from "./InvitationCard";

interface WrongAccountCardProps {
  invitationEmail: string;
  currentUserEmail: string;
  onSignOut: () => void;
}

export function WrongAccountCard({
  invitationEmail,
  currentUserEmail,
  onSignOut,
}: WrongAccountCardProps) {
  return (
    <InvitationCard
      title="Wrong account"
      description={
        <>
          This invitation was sent to <strong>{invitationEmail}</strong>, but you're signed in as{" "}
          <strong>{currentUserEmail}</strong>.
        </>
      }
    >
      <Alert variant="destructive">
        <AlertTitle>You can't accept this invitation</AlertTitle>
        <AlertDescription>
          Sign out and sign in with the email the invitation was sent to.
        </AlertDescription>
      </Alert>

      <Button variant="outline" className="w-full" onClick={onSignOut}>
        Sign out and continue
      </Button>
    </InvitationCard>
  );
}
