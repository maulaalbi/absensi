/*
  Warnings:

  - You are about to drop the column `status` on the `Attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "CheckIn" ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "CheckOut" ADD COLUMN     "status" TEXT;

-- DropEnum
DROP TYPE "AttendanceStatus";
