-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_globalScheduleId_fkey";

-- AlterTable
ALTER TABLE "Attendance" ALTER COLUMN "globalScheduleId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_globalScheduleId_fkey" FOREIGN KEY ("globalScheduleId") REFERENCES "GlobalSchedule"("barcode") ON DELETE RESTRICT ON UPDATE CASCADE;
