/*
  Warnings:

  - Added the required column `ip` to the `CheckOut` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CheckOut" ADD COLUMN     "ip" TEXT NOT NULL;
