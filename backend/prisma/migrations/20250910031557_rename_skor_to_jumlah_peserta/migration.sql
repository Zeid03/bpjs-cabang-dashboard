/*
  Warnings:

  - You are about to drop the column `skor` on the `viola` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `viola` DROP COLUMN `skor`,
    ADD COLUMN `jumlahPeserta` INTEGER NOT NULL DEFAULT 0;
