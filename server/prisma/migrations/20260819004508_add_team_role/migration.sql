-- CreateEnum
CREATE TYPE "TeamRole" AS ENUM ('LEAD', 'MEMBER');

-- AlterTable
ALTER TABLE "team_members" ADD COLUMN     "role" "TeamRole" NOT NULL DEFAULT 'MEMBER';
