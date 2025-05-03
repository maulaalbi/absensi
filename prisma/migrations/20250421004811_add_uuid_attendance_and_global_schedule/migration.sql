/*
  Warnings:

  - The required column `att_public_id` was added to the `Attendance` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `sch_public_id` was added to the `GlobalSchedule` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "att_public_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GlobalSchedule" ADD COLUMN     "sch_public_id" TEXT NOT NULL;
