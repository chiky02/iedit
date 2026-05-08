'use server';

import { prisma } from '@/lib/prisma';
import { createToken, setAuthCookie, verifyAuth, clearAuthCookie } from '@/lib/auth';
import bcryptjs from 'bcryptjs';

type PublicNewsResult =
  | {
      noticias: Array<{
        id: string;
        titulo: string;
        categoria: string;
        tipo: string;
        contenido: string;
        imagenUrl: string | null;
        esPublica: boolean;
        autor: { nombre: string };
        createdAt: string;
      }>;
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    }
  | { error: string };

function normalizeString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

async function getSessionUser() {
  const auth = await verifyAuth();
  if (!auth) return null;

  return prisma.user.findUnique({
    where: { id: auth.userId },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });
}

function hasPermission(user: Awaited<ReturnType<typeof getSessionUser>>, slug: string) {
  if (!user || !user.role) return false;
  return user.role.permissions.some((rolePermission) => rolePermission.permission.slug === slug);
}

async function requireAuth() {
  const user = await getSessionUser();
  if (!user || !user.isActive) {
    throw new Error('No autorizado');
  }
  return user;
}

async function requirePermission(slug: string) {
  const user = await requireAuth();
  if (!hasPermission(user, slug)) {
    throw new Error('Permiso denegado');
  }
  return user;
}

export async function loginAction(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: { include: { permissions: { include: { permission: true } } } } },
    });

    if (!user || !user.isActive) {
      return { error: 'Usuario o contraseña inválidos' };
    }

    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      return { error: 'Usuario o contraseña inválidos' };
    }

    const token = await createToken({
      userId: user.id,
      email: user.email,
    });

    await setAuthCookie(token);
    return { success: true };
  } catch (error) {
    console.error('Error en login:', error);
    return { error: 'Error al iniciar sesión' };
  }
}

export async function logoutAction() {
  await clearAuthCookie();
  return { success: true };
}

export async function getPublicNews(params: {
  page?: number;
  categoria?: string;
  tipo?: string;
  from?: string;
  to?: string;
}): Promise<PublicNewsResult> {
  try {
    const pageSize = 5;
    const page = params.page && params.page > 0 ? params.page : 1;
    const where: any = {
      esPublica: true,
    };

    if (params.tipo) {
      where.tipo = params.tipo;
    }

    if (params.categoria) {
      where.categoria = params.categoria;
    }

    if (params.from || params.to) {
      where.createdAt = {};
      if (params.from) {
        where.createdAt.gte = new Date(params.from);
      }
      if (params.to) {
        where.createdAt.lte = new Date(params.to);
      }
    }

    const total = await prisma.noticia.count({ where });
    const noticias = await prisma.noticia.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { autor: true },
    });

    // Format dates as strings to avoid hydration mismatch
    const noticiasWithFormattedDates = noticias.map((noticia) => ({
      ...noticia,
      createdAt: noticia.createdAt.toLocaleDateString('es-CO'),
    }));

    return {
      noticias: noticiasWithFormattedDates,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  } catch (error) {
    console.error('Error al obtener noticias públicas:', error);
    return { error: 'No se pudieron cargar las noticias' };
  }
}

export async function getNewsCategories() {
  const categories = await prisma.noticia.findMany({
    select: { categoria: true },
    orderBy: { categoria: 'asc' },
  });
  return Array.from(new Set(categories.map((item) => item.categoria))).sort();
}

export async function getAdminData() {
  await requireAuth();

  const [users, roles, noticias, suggestions, permissions] = await Promise.all([
    prisma.user.findMany({
      include: { role: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.role.findMany({
      include: { permissions: { include: { permission: true } } },
      orderBy: { nombre: 'asc' },
    }),
    prisma.noticia.findMany({
      include: { autor: true },
      orderBy: { createdAt: 'desc' },
      take: 30,
    }),
    prisma.sugerencia.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
    }),
    prisma.permission.findMany({
      orderBy: { slug: 'asc' },
    }),
  ]);

  // Format dates as strings to avoid hydration mismatch
  const noticiasWithFormattedDates = noticias.map((noticia) => ({
    ...noticia,
    createdAt: noticia.createdAt.toLocaleDateString('es-CO'),
  }));

  const suggestionsWithFormattedDates = suggestions.map((suggestion) => ({
    ...suggestion,
    createdAt: suggestion.createdAt.toLocaleDateString('es-CO'),
  }));

  return { users, roles, noticias: noticiasWithFormattedDates, suggestions: suggestionsWithFormattedDates, permissions };
}

export async function createNewsAction(
  titulo: string,
  contenido: string,
  categoria: string,
  tipo: string,
  imagenUrl: string,
  esPublica: boolean
) {
  try {
    const user = await requirePermission('noticias:create');
    const title = normalizeString(titulo);
    const body = normalizeString(contenido);
    const category = normalizeString(categoria);
    const type = normalizeString(tipo);

    if (!title || !body || !category || !type) {
      return { error: 'Todos los campos obligatorios deben completarse' };
    }

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${Date.now()}`;

    const noticia = await prisma.noticia.create({
      data: {
        titulo: title,
        slug,
        contenido: body,
        categoria: category,
        tipo: type as any,
        imagenUrl: normalizeString(imagenUrl) || null,
        esPublica,
        autorId: user.id,
      },
    });

    return { success: true, noticia };
  } catch (error) {
    console.error('Error al crear noticia:', error);
    return { error: error instanceof Error ? error.message : 'Error al guardar la noticia' };
  }
}

export async function updateNewsAction(
  id: string,
  titulo: string,
  contenido: string,
  categoria: string,
  tipo: string,
  imagenUrl: string,
  esPublica: boolean
) {
  try {
    await requirePermission('noticias:update');
    const title = normalizeString(titulo);
    const body = normalizeString(contenido);
    const category = normalizeString(categoria);
    const type = normalizeString(tipo);

    if (!id || !title || !body || !category || !type) {
      return { error: 'Todos los campos obligatorios deben completarse' };
    }

    await prisma.noticia.update({
      where: { id },
      data: {
        titulo: title,
        contenido: body,
        categoria: category,
        tipo: type as any,
        imagenUrl: normalizeString(imagenUrl) || null,
        esPublica,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error al actualizar noticia:', error);
    return { error: error instanceof Error ? error.message : 'Error al actualizar la noticia' };
  }
}

export async function deleteNewsAction(id: string) {
  try {
    await requirePermission('noticias:delete');
    await prisma.noticia.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar noticia:', error);
    return { error: error instanceof Error ? error.message : 'Error al eliminar la noticia' };
  }
}

export async function createUserAction(
  nombre: string,
  email: string,
  password: string,
  roleId: string
) {
  try {
    await requirePermission('usuarios:create');
    const name = normalizeString(nombre);
    const emailValue = normalizeString(email).toLowerCase();
    const passwordValue = normalizeString(password);

    if (!name || !emailValue || !passwordValue || !roleId) {
      return { error: 'Todos los campos obligatorios deben completarse' };
    }

    const hashedPassword = await bcryptjs.hash(passwordValue, 10);
    const user = await prisma.user.create({
      data: {
        nombre: name,
        email: emailValue,
        password: hashedPassword,
        roleId,
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return { error: error instanceof Error ? error.message : 'Error al guardar el usuario' };
  }
}

export async function updateUserAction(
  id: string,
  nombre: string,
  email: string,
  roleId: string,
  isActive: boolean,
  password?: string
) {
  try {
    await requirePermission('usuarios:update');
    const name = normalizeString(nombre);
    const emailValue = normalizeString(email).toLowerCase();

    if (!id || !name || !emailValue || !roleId) {
      return { error: 'Todos los campos obligatorios deben completarse' };
    }

    const data: any = {
      nombre: name,
      email: emailValue,
      roleId,
      isActive,
    };

    if (password && normalizeString(password).length > 0) {
      data.password = await bcryptjs.hash(normalizeString(password), 10);
    }

    await prisma.user.update({ where: { id }, data });
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return { error: error instanceof Error ? error.message : 'Error al actualizar el usuario' };
  }
}

export async function deleteUserAction(id: string) {
  try {
    await requirePermission('usuarios:delete');
    await prisma.user.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return { error: error instanceof Error ? error.message : 'Error al eliminar el usuario' };
  }
}

export async function createRoleAction(
  nombre: string,
  descripcion: string,
  permissionSlugs: string[]
) {
  try {
    await requirePermission('roles:create');
    const roleName = normalizeString(nombre);
    const roleDescription = normalizeString(descripcion);

    if (!roleName) {
      return { error: 'El nombre del rol es obligatorio' };
    }

    const permissions = await prisma.permission.findMany({
      where: { slug: { in: permissionSlugs } },
    });

    const role = await prisma.role.create({
      data: {
        nombre: roleName,
        descripcion: roleDescription || null,
      },
    });

    await Promise.all(
      permissions.map((permission) =>
        prisma.rolePermission.create({
          data: {
            roleId: role.id,
            permissionId: permission.id,
          },
        })
      )
    );

    return { success: true, role };
  } catch (error) {
    console.error('Error al crear rol:', error);
    return { error: error instanceof Error ? error.message : 'Error al guardar el rol' };
  }
}

export async function deleteRoleAction(id: string) {
  try {
    await requirePermission('roles:delete');
    const role = await prisma.role.findUnique({ where: { id }, include: { users: true } });
    if (!role) {
      return { error: 'Rol no encontrado' };
    }
    if (role.users.length > 0) {
      return { error: 'No se puede eliminar un rol asignado a usuarios' };
    }

    await prisma.role.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar rol:', error);
    return { error: error instanceof Error ? error.message : 'Error al eliminar el rol' };
  }
}

export async function deleteSuggestionAction(id: string) {
  try {
    await requirePermission('sugerencias:delete');
    await prisma.sugerencia.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar sugerencia:', error);
    return { error: error instanceof Error ? error.message : 'Error al eliminar la sugerencia' };
  }
}
