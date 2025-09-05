-- CreateTable
CREATE TABLE `KegiatanKeliling` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal` DATETIME(3) NOT NULL,
    `lokasi` VARCHAR(191) NOT NULL,
    `peserta` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Viola` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bulan` VARCHAR(191) NOT NULL,
    `skor` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IndeksPrima` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bulan` VARCHAR(191) NOT NULL,
    `nilai` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IndeksPengaduan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bulan` VARCHAR(191) NOT NULL,
    `jumlah` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
