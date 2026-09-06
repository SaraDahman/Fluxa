-- AlterTable
ALTER TABLE "teams" ADD CONSTRAINT "teams_workspaceId_name_key" UNIQUE ("workspaceId", "name");