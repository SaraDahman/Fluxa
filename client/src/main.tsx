import "@/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/providers/theme-provider.tsx";
import { QueryProvider } from "@/providers/query-provider.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "@/router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>
);
