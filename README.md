<div align="center">

# MinCommerce

**Tienda online minimalista construida con el stack moderno de React**

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![NextAuth](https://img.shields.io/badge/NextAuth.js-v5-purple?logo=auth0&logoColor=white)](https://authjs.dev/)

</div>

---

MinCommerce es una aplicacion e-commerce completa y funcional que implementa el flujo de compra de principio a fin: catalogo de productos, carrito de compras persistente, checkout con validacion de formularios, confirmacion de pedidos y panel de administracion. Desarrollada con Next.js 15 App Router, React 19, Prisma ORM y autenticacion con Google OAuth.

## Vista previa

<div align="center">

### Pagina de inicio
![Pagina de inicio - Hero y caracteristicas](./public/Home.png)

</div>

<details>
<summary><strong>Ver mas capturas</strong></summary>

<div align="center">

### Login
![Login con Google OAuth](./public/Login.png)

### Perfil
![Perfil con datos del usuario autenticado](./public/Perfil.png)

### Catalogo de productos
![Catalogo con tarjetas de productos, precios e indicadores de stock](./public/Catalogo.png)

### Carrito de compras
![Carrito con productos, cantidades editables y resumen del pedido](./public/Carrito.png)

### Checkout
![Formulario de envio con validacion y resumen de compra](./public/Checkout.png)

### Confirmacion de pedido
![Confirmacion con detalle de orden, productos y datos de envio](./public/Confirmacion.png)

### Panel de Administrador
![Panel de administrador con logs de actividad, historial de pedidos y productos](./public/Pedidos.png)

</div>

</details>

## Funcionalidades

- **Catalogo de productos** con imagenes, descripciones, precios e indicadores de stock
- **Carrito de compras** persistente en localStorage con Zustand
- **Checkout** con formulario validado (React Hook Form + Zod)
- **Autenticacion** con Google OAuth via NextAuth.js v5
- **Panel de Administrador** con logs de actividad, historial de pedidos y productos
- **Confirmacion de compra** con detalle completo e impresion de recibo
- **Tema claro/oscuro** con paleta personalizada (morado/rosa)
- **Responsive** optimizado para movil y escritorio
- **Notificaciones toast** para feedback de acciones

## Stack tecnologico

| Capa | Tecnologias |
|------|-------------|
| **Framework** | Next.js 15 (App Router, Turbopack) |
| **Frontend** | React 19, TypeScript 5, Tailwind CSS 4 |
| **Componentes** | shadcn/ui (Radix UI), Lucide Icons |
| **Estado** | Zustand 5 (carrito con persistencia) |
| **Formularios** | React Hook Form + Zod |
| **Base de datos** | PostgreSQL (Neon) + Prisma ORM 6 |
| **Autenticacion** | NextAuth.js v5 (Google OAuth) |
| **Despliegue** | Vercel |

## Inicio rapido

### Requisitos previos

- Node.js 18+
- npm
- Base de datos PostgreSQL (puede ser [Neon](https://neon.tech/) gratuito)
- Credenciales de Google OAuth ([Google Cloud Console](https://console.cloud.google.com/))

### Instalacion

```bash
# 1. Clonar el repositorio
git clone https://github.com/AlexanderG8/min-commerce-nextjs.git
cd min-commerce-nextjs

# 2. Instalar dependencias (genera Prisma Client automaticamente)
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
```

Editar `.env.local` con tus credenciales:

```env
DATABASE_URL=postgresql://usuario:password@host/database?sslmode=require
AUTH_SECRET=tu_secret_aleatorio
AUTH_GOOGLE_ID=tu_google_client_id
AUTH_GOOGLE_SECRET=tu_google_client_secret
```

```bash
# 4. Crear las tablas en la base de datos
npx prisma migrate dev

# 5. (Opcional) Poblar con datos de ejemplo
npm run seed

# 6. Iniciar el servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en tu navegador.

## Scripts disponibles

| Script | Comando | Descripcion |
|--------|---------|-------------|
| Dev | `npm run dev` | Servidor de desarrollo con Turbopack |
| Build | `npm run build` | Build de produccion |
| Start | `npm run start` | Iniciar servidor de produccion |
| Lint | `npm run lint` | Ejecutar ESLint |
| Seed | `npm run seed` | Poblar la base de datos con datos de ejemplo |

## Estructura del proyecto

```
min-commerce-nextjs/
├── app/
│   ├── api/                    # API Routes (products, orders, users, admin)
│   ├── admin/                  # Panel de administracion
│   ├── cart/                   # Carrito de compras
│   ├── catalog/                # Catalogo de productos
│   ├── checkout/               # Flujo de checkout
│   ├── order/                  # Historial y confirmacion de pedidos
│   ├── product/[id]/           # Detalle de producto
│   ├── profile/                # Perfil de usuario
│   ├── signin/                 # Inicio de sesion
│   ├── globals.css             # Variables CSS y estilos globales
│   ├── layout.tsx              # Layout raiz con providers
│   └── page.tsx                # Pagina de inicio
├── components/
│   ├── ui/                     # Componentes shadcn/ui (Radix)
│   ├── navbar.tsx              # Navegacion responsive
│   ├── product-card.tsx        # Tarjeta de producto
│   └── authbutton.tsx          # Boton de autenticacion
├── lib/
│   ├── prisma.ts               # Singleton de Prisma Client
│   ├── activity-logger.ts      # Sistema de logs de actividad
│   ├── store/store.ts          # Zustand store (carrito)
│   └── validation/validations.ts # Esquemas Zod
├── prisma/
│   ├── schema.prisma           # Modelos de base de datos
│   ├── migrations/             # Migraciones
│   └── seed.mjs                # Script de datos de ejemplo
├── auth.ts                     # Configuracion NextAuth.js
└── middleware.ts               # Proteccion de rutas
```

## Modelo de datos

```
User ──────< Order ──────< OrderItem >────── Product
  │
  └────< ActivityLog
```

- **User** — usuarios con rol (`user` / `admin`), creados automaticamente al iniciar sesion con Google
- **Product** — productos con nombre, descripcion, precio, stock e imagen
- **Order** — pedidos con datos del cliente, items y total
- **OrderItem** — items individuales de cada pedido con cantidad y precio
- **ActivityLog** — registro de acciones del usuario (login, logout, compras)

## Despliegue

El proyecto esta configurado para despliegue en **Vercel**:

```bash
# Usando Vercel CLI
npm install -g vercel
vercel
```

Las variables de entorno (`DATABASE_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`) deben configurarse en el dashboard de Vercel.

## Changelog

- [Update 20251029](documentations/Update_20251029.md) — Autenticacion, perfiles de usuario y logs de actividad
- [Update 20251028](documentations/Update_20251028.md) — Mejoras en la interfaz de administracion

## Autor

Desarrollado por **Alexander Gomez**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Marcello_Alexander_Gomez-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/marcello-alexander-gomez-gomez-130587268/)
[![GitHub](https://img.shields.io/badge/GitHub-AlexanderG8-181717?logo=github&logoColor=white)](https://github.com/AlexanderG8)
[![Portfolio](https://img.shields.io/badge/Portfolio-xanderg-5340ff?logo=vercel&logoColor=white)](https://xanderg.vercel.app/)
