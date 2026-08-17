import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Building2, Check, ChevronsUpDown, Plus } from "lucide-react";

import { useMe } from "@/features/auth/api/auth";

import { useWorkspaceStore } from "@/store/workspace.store";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import CreateWorkspaceDialog from "./CreateWorkspaceDialog";
import InviteMemberDialog from "./InviteMemberDialog";

export default function Workspaceswitcher() {
  const navigate = useNavigate();
  const { workspaceSlug } = useParams();
  const { setActiveWorkspace } = useWorkspaceStore();
  const { data } = useMe();

  const [createOpen, setCreateOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const workspaces = data?.workspaces ?? [];
  const current = workspaces.find((w) => w.workspace.slug === workspaceSlug);

  function handleSwitch(slug: string) {
    const ws = workspaces.find((w) => w.workspace.slug === slug);

    if (ws) {
      setActiveWorkspace({ id: ws.workspace.id, slug: ws.workspace.slug });
      navigate(`/${ws.workspace.slug}/my-tasks`);
    }
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
              <SidebarMenuButton
                size="lg"
                className="w-full rounded-lg px-2 py-1.5 transition-colors hover:bg-sidebar-hover"
              >
                <div className="flex w-full items-center gap-2.5">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white"
                    style={{ background: "#5B5FEF" }}
                  >
                    {current?.workspace.slug.slice(0, 2) ?? "—"}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-sm font-semibold text-sidebar-foreground">
                      {current?.workspace.name ?? "Select workspace"}
                    </p>
                    <p className="truncate text-[10px] text-sidebar-muted">
                      {current?.role.toLowerCase()}
                    </p>
                  </div>
                  <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-sidebar-muted" />
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-64" side="bottom" sideOffset={4}>
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Workspaces
                </DropdownMenuLabel>

                {workspaces.map((w) => {
                  const isActive = w.workspace.slug === workspaceSlug;

                  return (
                    <DropdownMenuItem
                      key={w.workspace.id}
                      className={cn("gap-2.5 cursor-pointer", isActive && "font-medium")}
                      onClick={() => handleSwitch(w.workspace.slug)}
                    >
                      <div
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white"
                        style={{ background: w.workspace.color }}
                      >
                        {w.workspace.name[0].toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm">{w.workspace.name}</p>
                        <p className="text-[10px] text-muted-foreground">{w.role.toLowerCase()}</p>
                      </div>

                      {isActive && <Check className="h-4 w-4 shrink-0 text-primary" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="h-4 w-4" /> Create workspace
              </DropdownMenuItem>

              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => setInviteOpen(true)}
              >
                <Building2 className="h-4 w-4" /> Invite members
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} />
      <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </>
  );
}
