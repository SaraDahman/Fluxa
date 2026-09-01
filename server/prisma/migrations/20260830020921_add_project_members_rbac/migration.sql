-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('ADMIN', 'MEMBER');

-- CreateTable
CREATE TABLE "project_members" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ProjectRole" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_members_projectId_idx" ON "project_members"("projectId");

-- CreateIndex
CREATE INDEX "project_members_userId_idx" ON "project_members"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "project_members_projectId_userId_key" ON "project_members"("projectId", "userId");

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Backfill every existing team member, mapping LEADs to project ADMINs
-- and MEMBERs to project MEMBERs before TeamRole is dropped, so no
-- project-scoped access is lost once authorization uses ProjectMember.
INSERT INTO "project_members" ("id", "projectId", "userId", "role", "createdAt")
SELECT gen_random_uuid(), p."id", tm."userId",
       CASE tm."role"
           WHEN 'LEAD' THEN 'ADMIN'::"ProjectRole"
           ELSE 'MEMBER'::"ProjectRole"
       END,
       now()
FROM "team_members" tm
JOIN "teams" t ON t."id" = tm."teamId"
JOIN "projects" p ON p."teamId" = t."id";

-- AlterTable: TeamMember no longer carries a role (derived from ProjectMember only)
ALTER TABLE "team_members" DROP COLUMN "role";

-- DropEnum
DROP TYPE "TeamRole";