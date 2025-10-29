import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas que requieren autenticación
const protectedRoutes = ['/profile', '/order']

// Rutas que requieren rol de administrador
const adminRoutes = ['/admin']

// Función optimizada para verificar autenticación usando cookies directamente
async function getSessionFromCookies(request: NextRequest) {
  console.log('🔍 Iniciando verificación de sesión...');
  
  // Log all cookies for debugging in production
  const allCookies = request.cookies.getAll();
  console.log('🍪 Cookies disponibles:', allCookies.map(c => `${c.name}: ${c.value.substring(0, 20)}...`));
  
  // Try multiple possible cookie names for different environments
  const possibleSessionTokenNames = [
    'authjs.session-token',
    '__Secure-authjs.session-token', 
    'next-auth.session-token',
    '__Secure-next-auth.session-token'
  ];
  
  let sessionToken = null;
  let tokenName = '';
  
  for (const name of possibleSessionTokenNames) {
    const token = request.cookies.get(name)?.value;
    if (token) {
      sessionToken = token;
      tokenName = name;
      console.log(`✅ Token encontrado en: ${name}`);
      break;
    }
  }
  
  if (!sessionToken) {
    console.log('❌ No se encontró token de sesión en ninguna cookie');
    return null;
  }

  console.log('✅ Token de sesión encontrado, usuario autenticado');
  
  // For NextAuth v5 with database sessions, we can't decode the encrypted token
  // in middleware. We'll assume the user is authenticated if there's a session token
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