-- 1) Tambah kolom-kolom baru (NULL dulu biar aman utk data lama)
ALTER TABLE `IndeksPrima`
  ADD COLUMN `tahun` INT NULL,
  ADD COLUMN `bulan_int` INT NULL,
  ADD COLUMN `wave1` INT NOT NULL DEFAULT 0,
  ADD COLUMN `wave2` INT NOT NULL DEFAULT 0,
  ADD COLUMN `wave3` INT NOT NULL DEFAULT 0,
  ADD COLUMN `wave4` INT NOT NULL DEFAULT 0;

-- 2) Backfill dari kolom lama `bulan` (format 'YYYY-MM')
UPDATE `IndeksPrima`
SET
  `tahun`     = CAST(SUBSTRING(`bulan`, 1, 4) AS UNSIGNED),
  `bulan_int` = CAST(SUBSTRING(`bulan`, 6, 2) AS UNSIGNED)
WHERE `bulan` IS NOT NULL AND `bulan` <> '';

-- 3) Jadikan NOT NULL setelah terisi
ALTER TABLE `IndeksPrima`
  MODIFY `tahun` INT NOT NULL,
  MODIFY `bulan_int` INT NOT NULL;

-- 4) HAPUS kolom `bulan` lama (string) AGAR TIDAK DUPLIKAT
ALTER TABLE `IndeksPrima`
  DROP COLUMN `bulan`;

-- 5) Rename `bulan_int` -> `bulan` (sekarang tipe INT)
ALTER TABLE `IndeksPrima`
  CHANGE COLUMN `bulan_int` `bulan` INT NOT NULL;

-- 6) (Opsional) Jika sudah tak butuh kolom `nilai` lama, boleh dihapus
-- ALTER TABLE `IndeksPrima` DROP COLUMN `nilai`;
