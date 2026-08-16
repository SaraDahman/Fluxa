import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Workspaceswitcher from "../../../features/workspaces/components/Workspaceswitcher";

import TopNav from "./TopNav";

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props} className="overflow-hidden bg-background">
      <SidebarHeader>
        <Workspaceswitcher />
      </SidebarHeader>
      <SidebarContent>
        <TopNav />
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
