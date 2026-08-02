import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { AuthShowcase } from "@/features/auth/components/AuthShowcase";
import { ThemeToggle } from "@/shared/components/common/ThemeToggle";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      <AuthShowcase />
      <div className="relative flex flex-col bg-background">
        {/* theme toggle */}
        <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
          <ThemeToggle />
        </div>

        {/* mobile brand header */}
        <div className="flex items-center gap-2.5 p-6 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-5 w-5 fill-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Fluxa</span>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-12">
          <div className="w-full max-w-sm animate-fade-up">
            <Outlet />
          </div>
        </div>

        <footer className="px-6 pb-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-foreground">
            © {new Date().getFullYear()} Fluxa
          </Link>
          <span className="mx-2">·</span>
          <span className="transition-colors hover:text-foreground">Privacy</span>
          <span className="mx-2">·</span>
          <span className="transition-colors hover:text-foreground">Terms</span>
        </footer>
      </div>
    </div>
  );
}
