import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { PATHS } from "@/router/paths";

import { InvitationCard } from "./InvitationCard";

interface InvitationMessageCardProps {
  title: string;
  description: ReactNode;
}

export function InvitationMessageCard({ title, description }: InvitationMessageCardProps) {
  return (
    <InvitationCard title={title} description={description}>
      <Button render={<Link to={PATHS.HOME} />} className="w-full">
        Go to Fluxa
      </Button>
    </InvitationCard>
  );
}
