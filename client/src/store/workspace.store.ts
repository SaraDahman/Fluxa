import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WorkspaceStore {
  activeWorkspaceId: string | null;
  activeWorkspaceSlug: string | null;

  setActiveWorkspace: (workspace: { id: string; slug: string }) => void;

  clearActiveWorkspace: () => void;
}

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set) => ({
      activeWorkspaceId: null,
      activeWorkspaceSlug: null,

      setActiveWorkspace: ({ id, slug }) =>
        set({
          activeWorkspaceId: id,
          activeWorkspaceSlug: slug,
        }),

      clearActiveWorkspace: () =>
        set({
          activeWorkspaceId: null,
          activeWorkspaceSlug: null,
        }),
    }),
    {
      name: "fluxa-workspace",
    }
  )
);
