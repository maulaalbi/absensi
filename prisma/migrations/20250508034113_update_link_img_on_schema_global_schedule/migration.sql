/*
  Warnings:

  - You are about to drop the column `location` on the `GlobalSchedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GlobalSchedule" DROP COLUMN "location",
ADD COLUMN     "linkImg" TEXT;
