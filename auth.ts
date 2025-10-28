import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

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
    // 1. Se ejecuta cada vez que se crea o actualiza una sesión (p. ej. al llamar auth() o useSession).
    // 2. Recibe el objeto session (lo que devolverá al cliente) y el token JWT decodificado.
    // 3. Si el token contiene el campo 'sub' (el ID del usuario en Google) y session.user existe,
    //    copiamos ese ID al objeto session.user para que esté disponible en el cliente.
    session({ session, token }) {
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
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.role = user.email === "mpalexanderg@gmail.com" ? "admin" : "user"
      }
      return token
    },
  },
})