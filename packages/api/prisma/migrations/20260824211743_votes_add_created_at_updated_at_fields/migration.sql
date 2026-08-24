/*
  Warnings:

  - Added the required column `updatedAt` to the `vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comment" ALTER COLUMN "parentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "vote" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
