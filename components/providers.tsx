// Este componente proveedor de autenticación se utiliza para envolver la aplicación en el cliente.
// Proporciona el contexto de sesión de NextAuth.js a todos los componentes hijos,
// permitiendo acceder a la información de autenticación (como el usuario actual)
// y métodos de autenticación (como signIn y signOut) en cualquier lugar de la aplicación.
"use client"
import { SessionProvider } from "next-auth/react"

export function AuthProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return <SessionProvider>{children}</SessionProvider>
}