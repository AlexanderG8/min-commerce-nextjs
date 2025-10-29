import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import { logUserActivity } from "@/lib/activity-logger"

// Sign in : es para autenticar a un usuario y crear una sesión.
// Sign out : es para cerrar la sesión de un usuario.
// Auth : es para verificar la sesión de un usuario y obtener información sobre él.
// Handles : es para manejar las solicitudes de autenticación (login, logout, callback, etc.).
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google
  ],
  pages:{
    signIn: "/", // Redirección si no hay sesión
  },
  callbacks: {
    // Se ejecuta después del login exitoso con el proveedor (Google)
    // Aquí registramos automáticamente al usuario en nuestra base de datos
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && user.email) {
        try {
          // Verificar si el usuario ya existe en nuestra base de datos
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          });

          if (!existingUser) {
            // Crear nuevo usuario en la base de datos
            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || user.email.split('@')[0],
                role: user.email === "mpalexanderg@gmail.com" ? "admin" : "user"
              }
            });
            
            // Actualizar el ID del usuario para usar nuestro ID de base de datos
            user.id = newUser.id.toString();
            console.log(`Nuevo usuario registrado: ${newUser.email} (ID: ${newUser.id})`);
            
            // Registrar actividad de primer login
            await logUserActivity(
              newUser.id,
              'LOGIN',
              'Usuario registrado y autenticado por primera vez'
            );
          } else {
            // Usuario existente, usar el ID de nuestra base de datos
            user.id = existingUser.id.toString();
            console.log(`Usuario existente logueado: ${existingUser.email} (ID: ${existingUser.id})`);
            
            // Registrar actividad de login
            await logUserActivity(
              existingUser.id,
              'LOGIN',
              'Usuario autenticado exitosamente'
            );
          }
        } catch (error) {
          console.error('Error al registrar/verificar usuario:', error);
          return false; // Rechazar el login si hay error en la base de datos
        }
      }
      return true;
    },

    // 1. Se ejecuta cada vez que se crea o actualiza una sesión (p. ej. al llamar auth() o useSession).
    // 2. Recibe el objeto session (lo que devolverá al cliente) y el token JWT decodificado.
    // 3. Si el token contiene el campo 'sub' (el ID del usuario en nuestra DB) y session.user existe,
    //    copiamos ese ID al objeto session.user para que esté disponible en el cliente.
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
        session.user.role = token.role as "admin" | "user"
      }
      return session
    },

    // 1. Se ejecuta cada vez que se crea o actualiza el JWT (p. ej. tras login, registro o actualización).
    // 2. Recibe el token actual y el objeto user (solo presente la primera vez que se crea el JWT).
    // 3. Si hay un objeto user (primer login), copiamos user.id al campo 'sub' del token
    //    para persistir el ID de usuario dentro del JWT.
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.role = user.email === "mpalexanderg@gmail.com" ? "admin" : "user"
      }
      return token
    },
  },
})