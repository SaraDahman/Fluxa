import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn, isRouteActive } from "@/lib/utils";
import { useLocation, useParams } from "react-router-dom";
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

export default function TopNav() {
  const { pathname } = useLocation();
  const { workspaceSlug } = useParams();

  const items: NavItem[] = [
    {
      id: "my-tasks",
      label: "My Tasks",
      icon: StickyNotes,
      path: `/${workspaceSlug}/my-tasks`,
      badge: 0,
    },
    {
      id: "boards",
      label: "Boards",
      icon: KanbanSquare,
      path: `/${workspaceSlug}/boards`,
    },
    {
      id: "backlog",
      label: "Backlog",
      icon: LayoutDashboard,
      path: `/${workspaceSlug}/backlog`,
    },
    {
      id: "sprints",
      label: "Sprints",
      icon: CalendarDays,
      path: `/${workspaceSlug}/sprints`,
    },
  ];

  return (
    <SidebarGroup key="top-nav">
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1">
          {items.map((item) => {
            const isActive = isRouteActive(
              item.id === "my-tasks" ? [item.path, `/${workspaceSlug}`] : item.path,
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
