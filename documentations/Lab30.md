Laboratorio 30: Middleware + Database Híbrido
Este laboratorio extiende el laboratorio 29 manteniendo JWT para el middleware (edge runtime) pero agregando persistencia en base de datos para usuarios y logging de sesiones.

🎯 Objetivos de Aprendizaje
Implementar estrategia híbrida: JWT + Database
Mantener middleware funcional mientras agregamos persistencia
Registrar sesiones de usuario en base de datos
Crear dashboard para visualizar actividad de sesiones
🔑 Conceptos Clave
1. Edge Runtime vs Node.js Runtime
Edge Runtime: Entorno ligero que corre en múltiples ubicaciones geográficas. Es rápido pero limitado (no puede usar Prisma, fs, etc.)
Node.js Runtime: Entorno completo del servidor. Puede usar todas las APIs pero es más lento y centralizado
Middleware siempre usa Edge Runtime por eso necesita JWT en lugar de database sessions
2. Estrategia de Sesión: JWT vs Database
JWT: Token autocontenido en cookies. Compatible con Edge Runtime pero no se puede invalidar fácilmente
Database: Sesiones guardadas en BD. Permiten control total pero requieren Node.js Runtime
Híbrido: JWT para middleware + BD para persistencia = mejor rendimiento y control
3. PrismaAdapter Functionality
Con JWT strategy: Solo guarda usuarios y cuentas OAuth en BD, sesiones van en cookies
Con Database strategy: Guarda todo en BD incluyendo sesiones activas
Lo que se guarda: User, Account, y opcionalmente Session según la estrategia
4. Callbacks vs Events en NextAuth
Callbacks: Se ejecutan durante el flujo de autenticación (jwt, session, signIn). Pueden modificar datos
Events: Se ejecutan después de que algo pasó (signOut, createUser). Solo para logging/efectos secundarios
Para logging: Usar signIn callback y signOut event
Parte 1 — Configuración Híbrida
Instalar dependencias
npm install @auth/prisma-adapter @prisma/client
npm install prisma --save-dev
Agrega un esquema inicial de autenticación a tu schema.prisma.
Guía oficial de next-auth
Ejecuta:

npx prisma db push
Crea el archivo lib/prisma.ts con:
import { PrismaClient } from "@prisma/client"
 
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
 
export const prisma = globalForPrisma.prisma || new PrismaClient()
 
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
Actualizar auth.ts con PrismaAdapter
// src/auth.ts - Agregar al inicio de las importaciones
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

// Agregar dentro de NextAuth()
adapter: PrismaAdapter(prisma), // Guarda usuarios y cuentas en BD
session: {
  strategy: "jwt", // MANTENER JWT para middleware
},
✅ Verificación
Haz login y verifica que se crea el usuario en tabla User
Tu middleware sigue funcionando sin cambios
Parte 2 — Log de Sesiones en Base de Datos
Agregar modelo SessionLog
// schema.prisma - Agregar al final
model SessionLog {
  id        String   @id @default(cuid())
  userId    String
  action    String   // 'login' o 'logout'
  provider  String?
  timestamp DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("session_logs")
}
// schema.prisma - Agregar en modelo User existente
sessionLogs   SessionLog[]     // Nueva relación
npx prisma db push
Registrar login en callback signIn
// src/auth.ts - Agregar dentro de callbacks
async signIn({ user, account }) {
  try {
    await prisma.sessionLog.create({
      data: {
        userId: user.id,
        action: 'login',
        provider: account?.provider || 'unknown',
      }
    })
  } catch (error) {
    console.error('Error registrando login:', error)
  }
  return true
},
Registrar logout en events
// src/auth.ts - Agregar fuera de callbacks, al mismo nivel
events: {
  async signOut({ token }) {
    if (token?.sub) {
      try {
        await prisma.sessionLog.create({
          data: {
            userId: token.sub,
            action: 'logout',
          }
        })
      } catch (error) {
        console.error('Error registrando logout:', error)
      }
    }
  },
},
✅ Verificación
Haz login/logout y verifica registros en tabla SessionLog
Parte 3 — Dashboard de Logs
Crear API para logs
// src/app/api/admin/session-logs/route.ts - Archivo completo nuevo
export async function GET() {
  const session = await auth()
  
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const logs = await prisma.sessionLog.findMany({
    include: {
      user: { select: { email: true, name: true } }
    },
    orderBy: { timestamp: 'desc' },
    take: 100
  })

  return NextResponse.json({ logs })
}
Crear página de dashboard
// src/app/admin/logs/page.tsx - Crear componente con:
// - useState para logs y loading
// - useEffect para fetch('/api/admin/session-logs')
// - Tabla con columnas: Usuario, Acción, Proveedor, Fecha
// - Styling con clases de Tailwind para green/red badges según login/logout
Función para formatear fecha
// Dentro del componente AdminLogsPage
const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
✅ Verificación
Accede a /admin/logs como admin
Ver tabla con eventos de login/logout ordenados por fecha