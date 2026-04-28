import { prisma } from '../lib/prisma';
import bcryptjs from 'bcryptjs';

async function main() {
  console.log('🌱 Seeding database...');
console.log("Tablas detectadas:", Object.keys(prisma).filter(k => !k.startsWith('$')));
  // 1. CREAR ROL Y USUARIO (Ahora el rol es obligatorio)
  const adminRole = await prisma.role.upsert({
    where: { nombre: 'admin' },
    update: {},
    create: { nombre: 'admin', descripcion: 'Administrador' },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@colegio.com' },
    update: {},
    create: {
      email: 'admin@colegio.com',
      password: await bcryptjs.hash('admin123', 10),
      nombre: 'Administrador',
      roleId: adminRole.id, // Vinculamos el usuario al rol
    },
  });

  console.log('✅ Admin user created');

  // 2. CREAR CATEGORÍAS (Necesarias para las transacciones)
  const catIngreso = await prisma.categoria.create({
    data: {
      nombre: 'Matrículas',
      tipo: 'INGRESO',
      subcategorias: { create: { nombre: 'General' } }
    },
    include: { subcategorias: true }
  });

  const catGasto = await prisma.categoria.create({
    data: {
      nombre: 'Nómina',
      tipo: 'GASTO',
      subcategorias: { create: { nombre: 'Docentes' } }
    },
    include: { subcategorias: true }
  });

  // 3. DATOS DE EJEMPLO (Adaptados a la nueva tabla Transaccion)
  const transaccionesPrueba = [
    {
      monto: 5000000,
      descripcion: 'Matrícula - Estudiante 001',
      fecha: new Date('2024-01-15'),
      usuarioId: admin.id,
      subcategoriaId: catIngreso.subcategorias[0].id,
      estado: 'APROBADO'
    },
    {
      monto: 2500000,
      descripcion: 'Salario - Docente',
      fecha: new Date('2024-01-30'),
      usuarioId: admin.id,
      subcategoriaId: catGasto.subcategorias[0].id,
      estado: 'APROBADO'
    }
  ];

  // 4. CREAR TRANSACCIONES
  for (const t of transaccionesPrueba) {
    await prisma.transaccion.create({ data: t });
  }

  console.log('✅ Sample data created');
  console.log('🎉 Seeding completed!');
}

main()
  .catch((error) => {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });