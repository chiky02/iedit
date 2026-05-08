# IEDIT Buzón de Sugerencias y Noticias

Aplicación web para gestionar noticias institucionales, roles administrativos y un buzón de sugerencias anónimas.

## Qué incluye
- CRUD completo de noticias
- CRUD completo de usuarios por parte del administrador
- Gestión de roles y permisos en formato CRUD
- Buzón de sugerencias público con protección básica contra envíos masivos
- Página pública de noticias con paginación y filtros por fecha, categoría y tipo
- Autenticación admin con JWT y cookies HTTP-only
- Seeder con datos iniciales
- Paleta de colores verde/amarillo inspirada en la imagen institucional

## Estructura principal
- `app/page.tsx` — Página pública de noticias y envío de sugerencias
- `app/admin/page.tsx` — Panel administrativo para gestionar noticias, usuarios, roles y sugerencias
- `app/login/page.tsx` — Login de administrador
- `app/actions.ts` — Server actions para crear/editar/eliminar contenidos y usuarios
- `app/api/suggestions/route.ts` — Endpoint público para recibir sugerencias
- `components/` — Componentes de UI especializados
- `lib/auth.ts` — JWT y cookies seguras
- `prisma/schema.prisma` — Modelo de datos actualizado
- `prisma/seed.ts` — Seed con admin, permisos y noticias de ejemplo

## Configuración
1. Copia el archivo de ambiente:
   ```bash
   cp .env.example .env
   ```
2. Ajusta `DATABASE_URL` y `AUTH_SECRET` en `.env`
3. Instala dependencias:
   ```bash
   npm install
   ```
4. Genera y aplica migraciones:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Ejecuta el seed:
   ```bash
   npm run prisma:seed
   ```
6. Inicia la app:
   ```bash
   npm run dev
   ```

## Credenciales de demostración
- Email: `admin@colegio.com`
- Password: `admin123`

## Notas de seguridad
- JWT firmado con `AUTH_SECRET`
- Cookie `auth-token` con `HttpOnly`, `SameSite=strict` y `path=/`
- Contraseñas cifradas con `bcryptjs`
- Formulario de sugerencias protegido contra envíos repetidos desde el mismo punto

## Dependencias clave
- Next.js 16
- React 19
- Prisma + MySQL
- jose
- bcryptjs

## Comandos útiles
- `npm run dev` — Desarrollo
- `npm run build` — Build de producción
- `npm run start` — Iniciar producción
- `npm run prisma:seed` — Seed de datos

