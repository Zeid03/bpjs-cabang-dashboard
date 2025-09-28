/*
  Warnings:

  - You are about to alter the column `wave1` on the `indeksprima` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `wave2` on the `indeksprima` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `wave3` on the `indeksprima` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `wave4` on the `indeksprima` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `nilai` on the `indeksprima` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `indeksprima` MODIFY `wave1` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `wave2` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `wave3` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `wave4` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `nilai` DOUBLE NOT NULL DEFAULT 0;
