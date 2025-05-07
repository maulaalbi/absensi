/*
  Warnings:

  - Added the required column `ip` to the `GlobalSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GlobalSchedule" ADD COLUMN     "ip" TEXT NOT NULL;
