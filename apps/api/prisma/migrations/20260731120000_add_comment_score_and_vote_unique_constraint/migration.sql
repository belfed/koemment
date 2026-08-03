-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Vote_commentId_userId_key" ON "Vote"("commentId", "userId");
