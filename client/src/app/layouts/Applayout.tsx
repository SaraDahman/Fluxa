import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import Appsidebar from "../components/sidebar/Appsidebar";
import { Search, Plus, PanelLeft } from "lucide-react";

import { ThemeToggle } from "@/shared/components/common/ThemeToggle";

function HeaderSidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      aria-label="Toggle sidebar"
      className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
    >
      <PanelLeft className="h-5 w-5" />
    </Button>
  );
}

export default function AppLayout() {
  return (
    <SidebarProvider>
      <Appsidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-card px-4">
          <HeaderSidebarToggle />

          <button className="flex h-8 flex-1 max-w-xs items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground transition-colors hover:border-input">
            <Search className="h-3.5 w-3.5" />
            <span>Search…</span>
            <kbd className="ml-auto hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium sm:inline-block">
              ⌘K
            </kbd>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" className="h-8 gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New</span>
            </Button>
            {/* <NotificationsPopover /> */}
            <ThemeToggle className="h-8 w-8" />
          </div>
        </header>
        <div className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="px-4">
            {/* <SidebarTrigger className="-ml-1" /> */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Build Your Application</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
