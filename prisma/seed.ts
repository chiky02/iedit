import { prisma } from '../lib/prisma';
import bcryptjs from 'bcryptjs';

async function main() {
  console.log('🌱 Seeding database...');

  // Crear usuario administrador
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@colegio.com' },
    update: {},
    create: {
      email: 'admin@colegio.com',
      password: await bcryptjs.hash('admin123', 10),
      nombre: 'Administrador',
      rol: 'admin',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Datos de ejemplo
  const ingresosPrueba = [
    {
      monto: 5000000,
      descripcion: 'Matrícula - Estudiante 001',
      categoria: 'Matrícula',
      fecha: new Date('2024-01-15'),
    },
    {
      monto: 3500000,
      descripcion: 'Matrícula - Estudiante 002',
      categoria: 'Matrícula',
      fecha: new Date('2024-01-16'),
    },
    {
      monto: 1000000,
      descripcion: 'Donación - Empresa XYZ',
      categoria: 'Donaciones',
      fecha: new Date('2024-02-01'),
    },
  ];

  const gastosPrueba = [
    {
      monto: 2500000,
      descripcion: 'Salario - Docente',
      categoria: 'Nómina',
      fecha: new Date('2024-01-30'),
    },
    {
      monto: 500000,
      descripcion: 'Servicios de agua y luz',
      categoria: 'Servicios',
      fecha: new Date('2024-02-05'),
    },
    {
      monto: 300000,
      descripcion: 'Materiales de papelería',
      categoria: 'Materiales',
      fecha: new Date('2024-02-10'),
    },
  ];

  // Crear ingresos
  for (const ingreso of ingresosPrueba) {
    await prisma.ingreso.create({
      data: ingreso,
    });
  }

  console.log('✅ Sample ingresos created');

  // Crear gastos
  for (const gasto of gastosPrueba) {
    await prisma.gasto.create({
      data: gasto,
    });
  }

  console.log('✅ Sample gastos created');
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
