import { prisma } from '../lib/prisma';
import bcryptjs from 'bcryptjs';

const permissions = [
  { slug: 'noticias:create', descripcion: 'Crear noticias' },
  { slug: 'noticias:read', descripcion: 'Ver noticias administrativas' },
  { slug: 'noticias:update', descripcion: 'Editar noticias' },
  { slug: 'noticias:delete', descripcion: 'Eliminar noticias' },
  { slug: 'usuarios:create', descripcion: 'Crear usuarios' },
  { slug: 'usuarios:read', descripcion: 'Ver usuarios' },
  { slug: 'usuarios:update', descripcion: 'Editar usuarios' },
  { slug: 'usuarios:delete', descripcion: 'Eliminar usuarios' },
  { slug: 'roles:create', descripcion: 'Crear roles' },
  { slug: 'roles:read', descripcion: 'Ver roles' },
  { slug: 'roles:update', descripcion: 'Editar roles' },
  { slug: 'roles:delete', descripcion: 'Eliminar roles' },
  { slug: 'sugerencias:read', descripcion: 'Ver buzón de sugerencias' },
  { slug: 'sugerencias:delete', descripcion: 'Eliminar sugerencias' },
];

async function upsertPermission(permission: { slug: string; descripcion: string }) {
  return prisma.permission.upsert({
    where: { slug: permission.slug },
    update: {},
    create: permission,
  });
}

async function assignPermission(roleId: string, permissionId: string) {
  return prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId,
        permissionId,
      },
    },
    update: {},
    create: {
      roleId,
      permissionId,
    },
  });
}

async function main() {
  console.log('🌱 Seeding database...');

  const createdPermissions = await Promise.all(permissions.map(upsertPermission));

  const adminRole = await prisma.role.upsert({
    where: { nombre: 'admin' },
    update: { descripcion: 'Administrador con todos los permisos' },
    create: {
      nombre: 'admin',
      descripcion: 'Administrador con todos los permisos',
    },
  });

  for (const permission of createdPermissions) {
    await assignPermission(adminRole.id, permission.id);
  }

  const editorRole = await prisma.role.upsert({
    where: { nombre: 'editor' },
    update: { descripcion: 'Editor de noticias' },
    create: {
      nombre: 'editor',
      descripcion: 'Editor de noticias',
    },
  });

  const editorPermissions = createdPermissions.filter((permission) =>
    ['noticias:create', 'noticias:read', 'noticias:update', 'noticias:delete'].includes(permission.slug)
  );

  for (const permission of editorPermissions) {
    await assignPermission(editorRole.id, permission.id);
  }

  const admin = await prisma.user.upsert({
    where: { email: 'admin@colegio.com' },
    update: {},
    create: {
      email: 'admin@colegio.com',
      password: await bcryptjs.hash('admin123', 10),
      nombre: 'Administrador',
      roleId: adminRole.id,
    },
  });

  await prisma.noticia.upsert({
    where: { slug: 'transparencia-financiera-2026' },
    update: {},
    create: {
      titulo: 'Transparencia financiera 2026',
      slug: 'transparencia-financiera-2026',
      contenido:
        '<p>Bienvenido al buzón de comunicación institucional donde encontrarás noticias sobre finanzas, eventos y decisiones escolares. Todas las novedades son publicadas por el equipo administrativo.</p>',
      categoria: 'Financiero',
      tipo: 'FINANCIERO',
      imagenUrl: null,
      esPublica: true,
      autorId: admin.id,
    },
  });

  await prisma.noticia.upsert({
    where: { slug: 'gran-festival-deportivo-2026' },
    update: {},
    create: {
      titulo: 'Gran festival deportivo 2026',
      slug: 'gran-festival-deportivo-2026',
      contenido:
        '<p>El colegio invita a toda la comunidad a participar en el festival deportivo del próximo mes. Habrá competencias, premiaciones y actividades para toda la familia.</p>',
      categoria: 'Eventos',
      tipo: 'EVENTO',
      imagenUrl: null,
      esPublica: true,
      autorId: admin.id,
    },
  });

  console.log('✅ Seed completed');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
