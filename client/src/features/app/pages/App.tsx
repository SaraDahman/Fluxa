import { useNavigate } from "react-router-dom";

import { clearSession, getStoredUser } from "@/features/auth/lib/auth-session";

import { PATHS } from "@/router/paths";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function AppPage() {
  const navigate = useNavigate();

  const user = getStoredUser();

  function handleSignOut() {
    clearSession();
    navigate(PATHS.SIGN_IN);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Avatar className="size-16">
        {user?.avatar ? (
          <AvatarImage src={user.avatar} alt="Avatar" />
        ) : (
          <AvatarFallback>{user?.username?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
        )}
      </Avatar>

      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome, {user?.username ?? user?.email}
        </h1>
        <p className="text-sm text-muted-foreground">
          {user?.title ? `${user.title} · ` : ""}profileComplete: {String(user?.profileComplete)}
        </p>
      </div>

      <Button variant="outline" onClick={handleSignOut}>
        Sign out
      </Button>
    </div>
  );
}
