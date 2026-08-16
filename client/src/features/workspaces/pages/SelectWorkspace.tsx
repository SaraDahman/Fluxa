import { useNavigate } from "react-router-dom";

import { useMe } from "@/features/auth/api/auth";
import { useWorkspaceStore } from "@/store/workspace.store";

import { FullPageLoader } from "@/shared/components/common/FullPageLoader";

import WorkspaceCard from "../components/WorkspaceCard";

export default function SelectWorkspace() {
  const navigate = useNavigate();
  const { setActiveWorkspace } = useWorkspaceStore();
  const { data, isLoading } = useMe();

  if (isLoading) {
    return <FullPageLoader />;
  }

  const workspaces = data?.workspaces ?? [];

  function handleSelect(slug: string, id: string) {
    setActiveWorkspace({ id, slug });
    navigate(`/${slug}/my-tasks`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-semibold tracking-tight">Choose a workspace</h1>
          <p className="text-sm text-muted-foreground">Select a workspace to continue.</p>
        </div>

        <div className="space-y-2">
          {workspaces.map((w) => (
            <WorkspaceCard
              key={w.workspace.id}
              name={w.workspace.name}
              slug={w.workspace.slug}
              role={w.role}
              onClick={() => handleSelect(w.workspace.slug, w.workspace.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
