// Este archivo expone los manejadores GET y POST de NextAuth.js para todas las rutas de autenticación bajo /api/auth/*
// (por ejemplo, /api/auth/signin, /api/auth/callback, /api/auth/signout, etc.).
// Re-exporta los manejadores configurados en el módulo "@/auth" para que Next.js pueda enrutar las solicitudes de autenticación entrantes a NextAuth.js.
// Esto permite que NextAuth.js maneje las solicitudes de autenticación (login, logout, callback, etc.)
// y devuelva las respuestas adecuadas al cliente.
import { handlers } from "@/auth"
export const { GET, POST } = handlers