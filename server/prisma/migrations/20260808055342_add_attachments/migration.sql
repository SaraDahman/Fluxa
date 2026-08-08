-- CreateTable
CREATE TABLE "attachments" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "uploaderId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT,
    "size" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attachments_key_key" ON "attachments"("key");

-- CreateIndex
CREATE INDEX "attachments_taskId_idx" ON "attachments"("taskId");

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
