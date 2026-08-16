import { useState } from "react";
import { Building2, Check, ChevronsUpDown, Plus } from "lucide-react";
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
  const [createOpen, setCreateOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const current = {
    id: "1",
    color: "#5B5FEF",
    slug: "FLUX",
    name: "Fluxa",
    members: 4,
  };

  const workspaces = [
    {
      id: "1",
      color: "#5B5FEF",
      slug: "FLUX",
      name: "Fluxa",
      members: 4,
    },
    {
      id: "2",
      color: "#16A34A",
      slug: "ACME",
      name: "Acme Corp",
      members: 2,
    },
    {
      id: "3",
      color: "#E54848",
      slug: "BETA",
      name: "Beta Team",
      members: 1,
    },
    {
      id: "4",
      color: "#F59E0B",
      slug: "GAMMA",
      name: "Gamma Group",
      members: 3,
    },
  ];

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
              <SidebarMenuButton
                size="lg"
                className="w-full ounded-lg px-2 py-1.5 transition-colors hover:bg-sidebar-hover"
              >
                <div className="flex w-full items-center gap-2.5">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white"
                    style={{ background: current?.color }}
                  >
                    {current?.slug.slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-sm font-semibold text-sidebar-foreground">
                      {current?.name}
                    </p>
                    <p className="truncate text-[10px] text-sidebar-muted">
                      {current?.members} member{current?.members !== 1 ? "s" : ""}
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
                {workspaces.map((ws) => {
                  const isActive = ws.id === current.id;
                  return (
                    <DropdownMenuItem
                      key={ws.id}
                      className={cn("gap-2.5", isActive && "font-medium")}
                    >
                      <div
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white"
                        style={{ background: ws.color }}
                      >
                        {ws.slug.slice(0, 2)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm">{ws.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {ws.members} member{ws.members !== 1 ? "s" : ""}
                        </p>
                      </div>
                      {isActive && <Check className="h-4 w-4 shrink-0 text-primary" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {/* create workspace */}
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="h-4 w-4" /> Create workspace
              </DropdownMenuItem>
              {/* invite members */}
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
