import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface NavbarLinkProps {
  href: string;
  onClick?: () => void;
  icon?: LucideIcon;
  label: string;
  isActive: boolean;
}

export default function NavbarLink({
  href,
  onClick,
  icon: Icon,
  label,
  isActive,
}: NavbarLinkProps) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-2 text-sm! transition-colors w-full h-full",
        isActive
          ? "bg-sidebar-active! text-sidebar-foreground!"
          : "text-sidebar-muted! hover:bg-sidebar-hover! hover:text-sidebar-foreground!"
      )}
    >
      {Icon && <Icon className="size-4! shrink-0" />}
      <span>{label}</span>
    </Link>
  );
}
