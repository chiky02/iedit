#!/usr/bin/env node

/**
 * Script para eliminar la base de datos (solo desarrollo)
 * Uso: npm run db:drop
 * ⚠️ ADVERTENCIA: Esto elimina TODA la BD y sus datos
 */

const mysql = require('mysql2/promise');
const readline = require('readline');
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askConfirmation(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

async function dropDatabase() {
  try {
    // Doble confirmación
    const confirmed = await askConfirmation(
      `\n⚠️  ¿Estás seguro de que deseas eliminar la BD "${DB_NAME}"? (s/n): `
    );

    if (!confirmed) {
      console.log('❌ Operación cancelada\n');
      process.exit(0);
    }

    const rl2 = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const confirmed2 = await new Promise((resolve) => {
      rl2.question(
        '⚠️  Escribe "eliminar" para confirmar (PUNTO DE NO RETORNO): ',
        (answer) => {
          rl2.close();
          resolve(answer === 'eliminar');
        }
      );
    });

    if (!confirmed2) {
      console.log('❌ Operación cancelada\n');
      process.exit(0);
    }

    console.log(`\n📡 Conectando a MySQL en ${DB_HOST}:${DB_PORT}...`);

    const connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    console.log('✅ Conectado\n');

    const dropDbQuery = `DROP DATABASE IF EXISTS \`${DB_NAME}\``;

    console.log(`🔨 Eliminando base de datos: ${DB_NAME}...`);
    await connection.execute(dropDbQuery);

    console.log(`✅ Base de datos '${DB_NAME}' eliminada\n`);

    console.log('Próximos pasos para recraarla:');
    console.log('   npm run db:create\n');

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error al eliminar la BD:');
    console.error(`   ${error.message}\n`);
    process.exit(1);
  }
}

dropDatabase();
