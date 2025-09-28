/*
  Warnings:

  - You are about to drop the column `target` on the `indeksprima` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `indeksprima` DROP COLUMN `target`;

-- CreateTable
CREATE TABLE `PrimaTarget` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tahun` INTEGER NOT NULL,
    `target` DOUBLE NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PrimaTarget_tahun_key`(`tahun`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
