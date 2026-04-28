/*
  Warnings:

  - You are about to drop the column `isActive` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `photoUrl` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the `categorias` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `noticias` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permisos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles_permisos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `soportes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subcategorias` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `terceros` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transacciones` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `noticias` DROP FOREIGN KEY `fk_noticia_autor`;

-- DropForeignKey
ALTER TABLE `roles_permisos` DROP FOREIGN KEY `fk_permission`;

-- DropForeignKey
ALTER TABLE `roles_permisos` DROP FOREIGN KEY `fk_role`;

-- DropForeignKey
ALTER TABLE `soportes` DROP FOREIGN KEY `fk_soporte_trans`;

-- DropForeignKey
ALTER TABLE `subcategorias` DROP FOREIGN KEY `fk_subcat_cat`;

-- DropForeignKey
ALTER TABLE `transacciones` DROP FOREIGN KEY `fk_trans_subcat`;

-- DropForeignKey
ALTER TABLE `transacciones` DROP FOREIGN KEY `fk_trans_tercero`;

-- DropForeignKey
ALTER TABLE `transacciones` DROP FOREIGN KEY `fk_trans_user`;

-- DropForeignKey
ALTER TABLE `usuarios` DROP FOREIGN KEY `fk_user_role`;

-- AlterTable
ALTER TABLE `usuarios` DROP COLUMN `isActive`,
    DROP COLUMN `lastLogin`,
    DROP COLUMN `photoUrl`,
    DROP COLUMN `roleId`,
    ADD COLUMN `rol` VARCHAR(191) NOT NULL DEFAULT 'admin';

-- DropTable
DROP TABLE `categorias`;

-- DropTable
DROP TABLE `noticias`;

-- DropTable
DROP TABLE `permisos`;

-- DropTable
DROP TABLE `roles`;

-- DropTable
DROP TABLE `roles_permisos`;

-- DropTable
DROP TABLE `soportes`;

-- DropTable
DROP TABLE `subcategorias`;

-- DropTable
DROP TABLE `terceros`;

-- DropTable
DROP TABLE `transacciones`;

-- CreateTable
CREATE TABLE `ingresos` (
    `id` VARCHAR(191) NOT NULL,
    `monto` DECIMAL(12, 2) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `categoria` VARCHAR(191) NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gastos` (
    `id` VARCHAR(191) NOT NULL,
    `monto` DECIMAL(12, 2) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `categoria` VARCHAR(191) NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
