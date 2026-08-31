-- Rename the workspace membership enum. Postgres updates the type of all
-- columns (workspace_members.role, workspace_invitations.role) and any default
-- expressions referencing "MemberRole" automatically — no data loss.
ALTER TYPE "MemberRole" RENAME TO "WorkspaceRole";