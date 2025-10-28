"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ShieldX, Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UnauthorizedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Si el usuario es admin, redirigir al admin panel
    if (session?.user?.role === "admin") {
      router.push("/admin");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <ShieldX className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Acceso No Autorizado
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400">
              No tienes permisos para acceder a esta página.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Solo los administradores pueden acceder al panel de administración.
            </p>
          </div>

          {/* Información del usuario actual */}
          {session?.user && (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sesión actual:
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {session.user.email}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Rol: {session.user.role || "usuario"}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={() => router.push("/")} 
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Volver al Inicio
            </Button>
            
            {!session && (
              <Button 
                variant="outline" 
                onClick={() => router.push("/")} 
                className="w-full"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </Button>
            )}
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-500">
            Si crees que esto es un error, contacta al administrador del sistema.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}