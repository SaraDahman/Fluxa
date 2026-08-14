import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn, isRouteActive } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import {
  CalendarDays,
  KanbanSquare,
  LayoutDashboard,
  StickyNotes,
  type LucideIcon,
} from "lucide-react";
import NavbarLink from "./NavbarLink";

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: number;
}

const items: NavItem[] = [
  {
    id: "my-tasks",
    label: "My Tasks",
    icon: StickyNotes,
    path: "/workspace/:workspaceId/my-tasks",
    badge: 0,
  },
  {
    id: "boards",
    label: "Boards",
    icon: KanbanSquare,
    path: "/workspace/:workspaceId/boards",
  },
  {
    id: "backlog",
    label: "Backlog",
    icon: LayoutDashboard,
    path: "/workspace/:workspaceId/backlog",
  },
  {
    id: "sprints",
    label: "Sprints",
    icon: CalendarDays,
    path: "/workspace/:workspaceId/sprints",
  },
];

export default function TopNav() {
  const { pathname } = useLocation();

  return (
    <SidebarGroup key="top-nav">
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1">
          {items.map((item) => {
            const isActive = isRouteActive(
              item.id === "my-tasks" ? [item.path, "/workspace/:workspaceId"] : item.path,
              pathname
            );

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton className={cn("p-0")}>
                  <NavbarLink
                    href={item.path}
                    icon={item.icon}
                    label={item.label}
                    isActive={isActive}
                  />
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
