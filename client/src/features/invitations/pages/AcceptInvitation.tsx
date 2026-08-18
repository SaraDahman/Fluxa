import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useQueryClient } from "@tanstack/react-query";

import { apiClient, getApiErrorMessage } from "@/lib/api-client";

import { clearSession, getAccessToken, saveUser } from "@/features/auth/lib/auth-session";
import type { AuthUser } from "@/features/auth/types";

import { useWorkspaceStore } from "@/store/workspace.store";

import { Spinner } from "@/components/ui/spinner";

import { CreateAccountCard } from "../components/CreateAccountCard";
import { InvitationMessageCard } from "../components/InvitationMessageCard";
import { JoinWorkspaceCard } from "../components/JoinWorkspaceCard";
import { WrongAccountCard } from "../components/WrongAccountCard";

import type {
  AcceptInvitationResponse,
  InvitationPreview,
  InvitationPreviewResponse,
  InvitationStatus,
} from "../types";
import type { GetMeResponse } from "@/features/auth/api/auth";

type AuthStatus = "authenticated" | "unauthenticated";

function getStatusMessage(status: InvitationStatus): string {
  switch (status) {
    case "EXPIRED":
      return "This invitation has expired.";
    case "ACCEPTED":
      return "This invitation has already been accepted.";
    case "REVOKED":
      return "This invitation was revoked.";
    default:
      return "This invitation is no longer available.";
  }
}

export default function AcceptInvitationPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setActiveWorkspace } = useWorkspaceStore();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [invitation, setInvitation] = useState<InvitationPreview | null>(null);
  const [pageError, setPageError] = useState<string | null>(
    !token ? "This invitation link is invalid. Please check the link and try again." : null
  );
  const [loading, setLoading] = useState(!token);

  const [authStatus, setAuthStatus] = useState<AuthStatus>("unauthenticated");
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const [accepting, setAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    async function resolveAuth(): Promise<{ status: AuthStatus; user?: AuthUser }> {
      if (!getAccessToken()) {
        return { status: "unauthenticated" };
      }

      try {
        const response = await apiClient.get<GetMeResponse>("/auth/me");

        return { status: "authenticated", user: response.data.data.user };
      } catch {
        clearSession();

        return { status: "unauthenticated" };
      }
    }

    async function load() {
      try {
        const [invitationResponse, auth] = await Promise.all([
          apiClient.get<InvitationPreviewResponse>(`/invitations/${token}`),
          resolveAuth(),
        ]);

        if (cancelled) return;

        setInvitation(invitationResponse.data.data);

        if (auth.status === "authenticated" && auth.user) {
          saveUser(auth.user);
          setCurrentUser(auth.user);
        }

        setAuthStatus(auth.status);
      } catch (error) {
        if (cancelled) return;
        setPageError(
          getApiErrorMessage(error, "This invitation is invalid or no longer available.")
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [token]);

  function handleSignOut() {
    clearSession();
    setCurrentUser(null);
    setAuthStatus("unauthenticated");
    setAcceptError(null);
  }

  async function handleAccept() {
    if (!token) return;

    setAccepting(true);
    setAcceptError(null);

    try {
      const response = await apiClient.post<AcceptInvitationResponse>("/invitations/accept", {
        token,
      });

      const { workspaceId } = response.data.data;

      const meData = await queryClient.fetchQuery<GetMeResponse>({
        queryKey: ["auth", "me"],
      });

      const workspace = meData.data.workspaces.find((w) => w.workspace.id === workspaceId);

      if (workspace) {
        setActiveWorkspace({ id: workspace.workspace.id, slug: workspace.workspace.slug });
        navigate(`/${workspace.workspace.slug}/my-tasks`);
      } else {
        navigate("/");
      }
    } catch (error) {
      setAcceptError(getApiErrorMessage(error, "We couldn't accept this invitation."));
    } finally {
      setAccepting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (pageError) {
    return <InvitationMessageCard title="Unable to load invitation" description={pageError} />;
  }

  if (!invitation || !token) {
    return null;
  }

  if (invitation.status !== "PENDING") {
    return (
      <InvitationMessageCard
        title="Invitation no longer available"
        description={getStatusMessage(invitation.status)}
      />
    );
  }

  const emailMatches = currentUser?.email.toLowerCase() === invitation.email.toLowerCase();

  if (authStatus === "authenticated" && !emailMatches) {
    return (
      <WrongAccountCard
        invitationEmail={invitation.email}
        currentUserEmail={currentUser?.email ?? ""}
        onSignOut={handleSignOut}
      />
    );
  }

  if (authStatus === "authenticated") {
    return (
      <JoinWorkspaceCard
        workspaceName={invitation.workspace.name}
        role={invitation.role}
        currentUserEmail={currentUser?.email ?? ""}
        accepting={accepting}
        acceptError={acceptError}
        onAccept={handleAccept}
        onSignOut={handleSignOut}
      />
    );
  }

  return (
    <CreateAccountCard
      token={token}
      workspaceName={invitation.workspace.name}
      role={invitation.role}
    />
  );
}
