-- 1. Tabla de Roles
CREATE TABLE `roles` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` TEXT NULL,
    UNIQUE INDEX `roles_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Tabla de Permisos
CREATE TABLE `permisos` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `descripcion` TEXT NULL,
    UNIQUE INDEX `permisos_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3. Tabla Intermedia de Roles y Permisos (Muchos a Muchos)
CREATE TABLE `roles_permisos` (
    `roleId` VARCHAR(191) NOT NULL,
    `permissionId` VARCHAR(191) NOT NULL,
    PRIMARY KEY (`roleId`, `permissionId`),
    CONSTRAINT `fk_role` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_permission` FOREIGN KEY (`permissionId`) REFERENCES `permisos`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 4. Tabla de Usuarios
CREATE TABLE `usuarios` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `photoUrl` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `lastLogin` DATETIME(3) NULL,
    `roleId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `usuarios_email_key`(`email`),
    CONSTRAINT `fk_user_role` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 5. Tabla de Noticias y Eventos
CREATE TABLE `noticias` (
    `id` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `contenido` TEXT NOT NULL,
    `imagenUrl` VARCHAR(191) NULL,
    `fechaEvento` DATETIME(3) NULL,
    `esPublica` BOOLEAN NOT NULL DEFAULT true,
    `autorId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    CONSTRAINT `fk_noticia_autor` FOREIGN KEY (`autorId`) REFERENCES `usuarios`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 6. Tabla de Categorías Financieras
CREATE TABLE `categorias` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `tipo` ENUM('INGRESO', 'GASTO') NOT NULL,
    `color` VARCHAR(191) NULL,
    UNIQUE INDEX `categorias_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 7. Tabla de Subcategorías
CREATE TABLE `subcategorias` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `categoriaId` VARCHAR(191) NOT NULL,
    CONSTRAINT `fk_subcat_cat` FOREIGN KEY (`categoriaId`) REFERENCES `categorias`(`id`) ON DELETE CASCADE,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 8. Tabla de Terceros (Proveedores/Contratistas)
CREATE TABLE `terceros` (
    `id` VARCHAR(191) NOT NULL,
    `nit` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NULL,
    UNIQUE INDEX `terceros_nit_key`(`nit`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 9. Tabla de Transacciones (El Corazón Financiero)
CREATE TABLE `transacciones` (
    `id` VARCHAR(191) NOT NULL,
    `monto` DECIMAL(12, 2) NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `estado` ENUM('PENDIENTE', 'APROBADO', 'ANULADO') NOT NULL DEFAULT 'APROBADO',
    `metodoPago` VARCHAR(191) NULL,
    `subcategoriaId` VARCHAR(191) NOT NULL,
    `terceroId` VARCHAR(191) NULL,
    `usuarioId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    CONSTRAINT `fk_trans_subcat` FOREIGN KEY (`subcategoriaId`) REFERENCES `subcategorias`(`id`),
    CONSTRAINT `fk_trans_tercero` FOREIGN KEY (`terceroId`) REFERENCES `terceros`(`id`),
    CONSTRAINT `fk_trans_user` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 10. Tabla de Soportes (Fotos de recibos/facturas)
CREATE TABLE `soportes` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `nombreArchivo` VARCHAR(191) NULL,
    `transaccionId` VARCHAR(191) NOT NULL,
    CONSTRAINT `fk_soporte_trans` FOREIGN KEY (`transaccionId`) REFERENCES `transacciones`(`id`) ON DELETE CASCADE,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;