-- AlterTable
ALTER TABLE "workspace_invitations" ADD COLUMN     "token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "workspace_invitations_token_key" ON "workspace_invitations"("token");
