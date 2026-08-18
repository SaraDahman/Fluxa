import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Workspaceswitcher from "../../../features/workspaces/components/Workspaceswitcher";
import TeamsNav from "./TeamsNav";
import TopNav from "./TopNav";
import UserNav from "./UserNav";

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props} className="overflow-hidden bg-background">
      <SidebarHeader>
        <Workspaceswitcher />
      </SidebarHeader>
      <SidebarContent>
        <TopNav />
        <TeamsNav />
      </SidebarContent>
      <SidebarFooter>
        <UserNav />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
