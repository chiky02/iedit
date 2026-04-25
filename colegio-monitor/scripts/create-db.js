#!/usr/bin/env node

/**
 * Script para crear la base de datos automáticamente
 * Uso: npm run db:create
 */

const mysql = require('mysql2/promise');
const path = require('path');

// Cargar variables de entorno
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const {
  DB_HOST = '172.22.197.166',
  DB_PORT = 3306,
  DB_USER = 'root',
  DB_PASSWORD = '2105',
  DB_NAME = 'colegio_monitor',
} = process.env;

async function createDatabase() {
  let connection;

  try {
    console.log(`\n📡 Conectando a MySQL en ${DB_HOST}:${DB_PORT}...`);

    // Conectar sin especificar BD (para crear la nueva)
    connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      waitForConnections: true,
      connectionLimit: 1,
      queueLimit: 0,
    });

    console.log('✅ Conectado exitosamente\n');

    // Crear BD si no existe
    const createDbQuery = `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`;

    console.log(`🔨 Creando base de datos: ${DB_NAME}...`);
    await connection.execute(createDbQuery);

    console.log(`✅ Base de datos '${DB_NAME}' creada/verificada exitosamente`);
    console.log('\n📝 Próximos pasos:');
    console.log('   1. npm run migrate       → Aplicar migraciones Prisma');
    console.log('   2. npm run prisma:seed  → Cargar datos de prueba');
    console.log('   3. npm run dev          → Iniciar servidor\n');

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error al crear la base de datos:');
    console.error(`   ${error.message}\n`);

    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 Verifica tus credenciales en .env.local:');
      console.error(`   - DB_HOST: ${DB_HOST}`);
      console.error(`   - DB_PORT: ${DB_PORT}`);
      console.error(`   - DB_USER: ${DB_USER}`);
      console.error(
        '\n⚠️  En Windows, si falla con IP, intenta con: DB_HOST=localhost\n'
      );
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 No se puede conectar a MySQL. Verifica:');
      console.error(`   1. MySQL está corriendo en ${DB_HOST}:${DB_PORT}`);
      console.error('   2. Las credenciales en .env.local son correctas');
      console.error(
        '   3. En Windows: Intenta cambiar DB_HOST=localhost si usas IP\n'
      );
    }

    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

createDatabase();
