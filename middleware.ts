import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

// Rutas que requieren autenticación
const protectedRoutes = ['/profile', '/order']

// Rutas que requieren rol de administrador
const adminRoutes = ['/admin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar si la ruta requiere rol de administrador
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Verificar si la ruta actual está protegida
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  if (isAdminRoute) {
    // Obtener la sesión del usuario
    const session = await auth()

    // Si no hay sesión, redirigir a la página principal
    if (!session) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    // Si hay sesión pero no es admin, redirigir a página de no autorización
    if (session.user.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/unauthorized'
      return NextResponse.redirect(url)
    }
  } else if (isProtectedRoute) {
    // Obtener la sesión del usuario
    const session = await auth()

    // Si no hay sesión, redirigir a la página principal
    if (!session) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  // Continuar con la solicitud si no es una ruta protegida o si está autenticado
  return NextResponse.next()
}

// Configurar en qué rutas debe ejecutarse el middleware
export const config = {
  matcher: [
    /*
     * Ejecutar middleware en todas las rutas excepto:
     * - api (API routes)
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (favicon)
     * - archivos con extensión (js, css, png, etc.)
     * '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
     */
    '/profile/:path*',
    '/order/:path*',
    '/admin/:path*',
  ],
}