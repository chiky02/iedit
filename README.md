# 🎓 Transparencia Financiera - Colegio Monitor

Aplicación web moderna de transparencia financiera para instituciones educativas.

**Stack:** Next.js 16 • Prisma ORM • MySQL 8 • Tailwind CSS • Recharts

---

## ⚡ QUICK START

### 1️⃣ Copia archivo de configuración
```bash
cd ..  # ir a la raíz del workspace
cp .env.example .env
# Ajusta las credenciales de tu MySQL en .env
```

### 2️⃣ Setup automático (lo más fácil)
```bash
npm run setup
```

**¡Hecho!** Todo se configura automáticamente:
- ✅ Instala dependencias
- ✅ Crea base de datos
- ✅ Aplica migraciones
- ✅ Carga datos de prueba

### 3️⃣ Inicia el servidor
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📋 Credenciales de Prueba

```
Email:    admin@colegio.com
Password: admin123
```

---

## 📚 Documentación

- **[INICIO_RAPIDO.md](INICIO_RAPIDO.md)** - Guía rápida de instalación
- **[SETUP_AUTOMATED.md](SETUP_AUTOMATED.md)** - Scripts automáticos y troubleshooting
- **[ESTRUCTURA.md](ESTRUCTURA.md)** - Arquitectura del proyecto
- **[.env.example](.env.example)** - Variables de configuración

---

## 🔧 Comandos Disponibles

### Setup & Base de Datos

```bash
npm run setup              # ⚡ Setup automático completo
npm run db:create         # 🔨 Crear base de datos
npm run db:drop           # 🗑️  Eliminar base de datos (cuidado)
```

### Migraciones & Datos

```bash
npm run migrate           # 📦 Aplicar migraciones (desarrollo)
npm run migrate:prod      # 📦 Aplicar migraciones (producción)
npm run prisma:seed      # 🌱 Cargar datos de prueba
npm run prisma:generate  # 🔄 Regenerar cliente Prisma
```

### Desarrollo

```bash
npm run dev              # 🚀 Iniciar servidor en desarrollo
npm run build            # 🏗️  Build para producción
npm start               # ▶️  Iniciar servidor en producción
npm run lint            # 🔍 Verificar linting
```

### Utilidades

```bash
npx prisma studio      # 👁️  Ver BD visualmente
npx prisma db info    # ℹ️  Información de la BD
npx prisma validate   # ✓ Validar schema
```

---

## 📊 Funcionalidades

### 🔓 Página Pública (`/`)

- **Dashboard** con 3 tarjetas de resumen
  - Total Ingresos
  - Total Gastos
  - Saldo Disponible

- **Gráficos interactivos**
  - Gráfico de barras: Ingresos vs Gastos por categoría
  - Gráfico de torta: Proporción ingresos/gastos

- **Tabla de movimientos**
  - Listado completo ordenado por fecha
  - Clasificación por tipo (ingreso/gasto)
  - Formateo de moneda en COP

### 🔐 Panel Administrativo (`/admin`)

Solo accesible con login:

- **Formulario de Ingresos**
  - Monto, descripción, categoría, fecha

- **Formulario de Gastos**
  - Monto, descripción, categoría, fecha

- **Categorías predefinidas**
  - Ingresos: Matrícula, Donaciones, Actividades
  - Gastos: Nómina, Servicios, Mantenimiento, Materiales

### 🔑 Autenticación (`/login`)

- Login seguro con JWT
- Cookies HTTP-only
- Logout funcional
- Redirección automática

---

## 🛠️ Stack Tecnológico

```
Frontend:        Next.js 16 (App Router)
React:           React 19
Estilos:         Tailwind CSS v4
Base de Datos:   Prisma ORM
MySQL:           MySQL 8
Gráficos:        Recharts
Autenticación:   JWT (jose)
Hashing:         bcryptjs
TypeScript:      Strict mode
```

---

## 🔐 Seguridad

- ✅ Server Actions con validación de autenticación
- ✅ Contraseñas hasheadas con bcryptjs
- ✅ JWT en cookies HTTP-only
- ✅ Protección contra SQL injection (Prisma)
- ✅ CSRF automático (Next.js)
- ✅ TypeScript strict mode

---

## 📁 Estructura del Proyecto

```
colegio-monitor/
│
├── 📁 app/                          # Next.js App Router
│   ├── page.tsx                    # Dashboard público
│   ├── actions.ts                  # Server Actions
│   ├── login/page.tsx              # Página login
│   ├── admin/page.tsx              # Panel administrativo
│   └── admin/logout/route.ts       # Ruta logout
│
├── 📁 components/                  # Componentes React
│   ├── Dashboard.tsx               # Tarjetas de resumen
│   ├── Graficos.tsx                # Gráficos
│   ├── TablaMovimientos.tsx        # Tabla de datos
│   ├── FormularioMovimiento.tsx    # Formularios
│   ├── FormularioLogin.tsx         # Login
│   ├── CurrencyFormatter.tsx       # Moneda COP
│   └── Navbar.tsx                  # Barra de navegación
│
├── 📁 lib/                         # Utilidades
│   ├── prisma.ts                   # Cliente Prisma (singleton)
│   └── auth.ts                     # JWT y autenticación
│
├── 📁 prisma/                      # ORM
│   ├── schema.prisma               # Esquema de BD
│   └── seed.ts                     # Datos iniciales
│
├── 📁 scripts/                     # Scripts de automatización
│   ├── create-db.js                # Crear BD
│   └── drop-db.js                  # Eliminar BD
│
├── package.json                    # Dependencias
├── tsconfig.json                   # TypeScript config
└── README.md                       # Este archivo

(En la raíz del workspace /home/Juan/iedit/):
├── .env                            # Variables de entorno (compartido)
├── .env.example                    # Template de variables
└── ... (otros archivos)
```

---

## 💾 Esquema de Base de Datos

### Usuario
```prisma
- id: String @id
- email: String @unique
- password: String (hasheada)
- nombre: String
- rol: String (admin)
- createdAt, updatedAt: DateTime
```

### Ingreso
```prisma
- id: String @id
- monto: Decimal(12,2)
- descripcion: Text
- categoria: String
- fecha: DateTime
- createdAt, updatedAt: DateTime
```

### Gasto
```prisma
- id: String @id
- monto: Decimal(12,2)
- descripcion: Text
- categoria: String
- fecha: DateTime
- createdAt, updatedAt: DateTime
```

---

## ⚙️ Configuración

### Variables de Entorno (`.env` - raíz del workspace)

```env
# Servidor MySQL
DB_HOST=localhost           # localhost para desarrollo
DB_PORT=3306                # Puerto MySQL
DB_USER=root                # Usuario MySQL
DB_PASSWORD=2105            # Contraseña MySQL
DB_NAME=colegio_monitor     # Nombre BD

DATABASE_URL="mysql://root:2105@localhost:3306/colegio_monitor"

# Seguridad
AUTH_SECRET=supersecreto    # Cambiar a valor seguro en producción
```

📍 **Ubicación:** El archivo `.env` debe estar en `/home/Juan/iedit/` (raíz del workspace)

⚠️ **NO incluir en Git:** Este archivo tiene credenciales sensibles

---

## 🚨 Troubleshooting

### ❌ "Cannot find module 'mysql2'"
```bash
npm install
```

### ❌ "Access denied for user 'root'"
- Verifica `DB_USER` y `DB_PASSWORD` en `.env` (raíz)
- Asegúrate de que coincidan con tu servidor MySQL

### ❌ "Cannot connect to 172.22.197.166"
**En Windows**: Cambia a `DB_HOST=localhost` en `.env.local`

### ❌ "ECONNREFUSED"
MySQL no está corriendo. Inicia el servicio:

**Windows:**
```
Services → busca "MySQL" → Iniciar
```

**Linux:**
```bash
sudo service mysql start
```

**macOS:**
```bash
brew services start mysql-community-server
```

### ❌ Problemas con Prisma
```bash
# Regenerar cliente
npm run prisma:generate

# Resetear BD (borra datos)
npm run db:drop && npm run db:create && npm run migrate
```

---

## 🚀 Deploy a Producción

### Variables de Entorno
```bash
# Cambiar a valores seguros
AUTH_SECRET=<generar-valor-aleatorio-seguro>
DB_HOST=<servidor-producción>
DB_USER=<usuario-producción>
DB_PASSWORD=<password-fuerte>
```

### Build
```bash
npm run build
npm start
```

### Con Vercel (Recomendado)
```bash
# Conectar con Vercel
vercel

# Variables de entorno en Vercel:
# DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, AUTH_SECRET
```

---

## 📞 Soporte

Documentación adicional:
- [Next.js](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts](https://recharts.org)

---

## 📄 Licencia

Este proyecto es de uso interno para instituciones educativas.

---

**🎉 ¡Listo para usar!** Ejecuta `npm run setup` para empezar.
