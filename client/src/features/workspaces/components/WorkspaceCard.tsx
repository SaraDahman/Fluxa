import { ArrowRight } from "lucide-react";

import type { WorkspaceRole } from "../types";

interface WorkspaceCardProps {
  name: string;
  slug: string;
  role: WorkspaceRole;
  onClick: () => void;
}

export default function WorkspaceCard({ name, slug, role, onClick }: WorkspaceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
        {slug.slice(0, 2).toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">
          {role.charAt(0) + role.slice(1).toLowerCase()}
        </p>
      </div>

      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </button>
  );
}
