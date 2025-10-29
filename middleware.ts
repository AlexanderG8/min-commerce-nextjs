import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas que requieren autenticación
const protectedRoutes = ['/profile', '/order']

// Rutas que requieren rol de administrador
const adminRoutes = ['/admin']

// Función optimizada para verificar autenticación usando cookies directamente
function getSessionFromCookies(request: NextRequest) {
  console.log('🔍 Iniciando verificación de sesión...');
  
  // Check for session token
  const sessionToken = request.cookies.get('authjs.session-token')?.value;
  
  if (!sessionToken) {
    console.log('❌ No se encontró token de sesión');
    return null;
  }

  console.log('✅ Token de sesión encontrado');

  // For NextAuth v5 with database sessions, we can't decode the encrypted token
  // in middleware. Instead, we'll use a simple approach:
  // If there's a session token, assume the user is authenticated
  // Pages will handle role verification through server components
  
  console.log('✅ Usuario autenticado (token de sesión presente)');
  
  return { 
    user: { 
      email: 'authenticated-user', // Placeholder
      role: 'user' // Default role, pages will verify admin status
    } 
  };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rutas que requieren autenticación
  const protectedRoutes = ['/admin', '/profile', '/checkout', '/order'];
  
  // Verificar si la ruta actual requiere autenticación
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    const session = getSessionFromCookies(request);
    
    if (!session) {
      console.log(`❌ Acceso denegado a ${pathname} - No autenticado`);
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    
    console.log(`✅ Acceso permitido a ${pathname} - Usuario autenticado`);
    // Let the page components handle admin role verification
  }
  
  return NextResponse.next();
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