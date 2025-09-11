/*
  Warnings:

  - You are about to drop the column `jenisLayanan` on the `viola` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `viola` DROP COLUMN `jenisLayanan`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `kabupaten` VARCHAR(191) NULL DEFAULT '',
    MODIFY `kecamatan` VARCHAR(191) NULL DEFAULT '',
    ALTER COLUMN `jumlahPeserta` DROP DEFAULT;
