/*
  Warnings:

  - Added the required column `ip` to the `CheckIn` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CheckIn" ADD COLUMN     "ip" TEXT NOT NULL;
