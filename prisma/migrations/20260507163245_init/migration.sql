/*
  Warnings:

  - You are about to drop the `Categoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subcategoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaccion` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Noticia` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoria` to the `Noticia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Noticia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `Noticia` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Subcategoria` DROP FOREIGN KEY `Subcategoria_categoriaId_fkey`;

-- DropForeignKey
ALTER TABLE `Transaccion` DROP FOREIGN KEY `Transaccion_subcategoriaId_fkey`;

-- DropForeignKey
ALTER TABLE `Transaccion` DROP FOREIGN KEY `Transaccion_usuarioId_fkey`;

-- AlterTable
ALTER TABLE `Noticia` ADD COLUMN `categoria` VARCHAR(191) NOT NULL,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL,
    ADD COLUMN `tipo` ENUM('FINANCIERO', 'EVENTO', 'OTRO') NOT NULL;

-- DropTable
DROP TABLE `Categoria`;

-- DropTable
DROP TABLE `Subcategoria`;

-- DropTable
DROP TABLE `Transaccion`;

-- CreateTable
CREATE TABLE `Sugerencia` (
    `id` VARCHAR(191) NOT NULL,
    `remitente` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `mensaje` LONGTEXT NOT NULL,
    `anonimidad` BOOLEAN NOT NULL DEFAULT true,
    `sourceHash` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Noticia_slug_key` ON `Noticia`(`slug`);
