"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ShoppingCart, Chrome } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Componente que maneja los search params
function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (session?.user) {
      router.push(callbackUrl);
    }
  }, [session, router, callbackUrl]);

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { 
        callbackUrl,
        redirect: true 
      });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  // Mostrar loading mientras se verifica la sesión
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Verificando sesión...</span>
        </div>
      </div>
    );
  }

  // Si ya está autenticado, no mostrar nada (se redirigirá)
  if (session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Inicia sesión para continuar con tu compra
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {error === "OAuthSignin" && "Error al iniciar sesión con Google. Inténtalo de nuevo."}
                  {error === "OAuthCallback" && "Error en el proceso de autenticación. Inténtalo de nuevo."}
                  {error === "OAuthCreateAccount" && "Error al crear la cuenta. Inténtalo de nuevo."}
                  {error === "EmailCreateAccount" && "Error al crear la cuenta con este email."}
                  {error === "Callback" && "Error en el proceso de autenticación."}
                  {error === "OAuthAccountNotLinked" && "Esta cuenta ya está asociada con otro proveedor."}
                  {error === "EmailSignin" && "Error al enviar el email de verificación."}
                  {error === "CredentialsSignin" && "Credenciales inválidas."}
                  {error === "SessionRequired" && "Debes iniciar sesión para acceder a esta página."}
                  {!["OAuthSignin", "OAuthCallback", "OAuthCreateAccount", "EmailCreateAccount", "Callback", "OAuthAccountNotLinked", "EmailSignin", "CredentialsSignin", "SessionRequired"].includes(error) && 
                    "Ocurrió un error durante el inicio de sesión. Inténtalo de nuevo."
                  }
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Button 
                onClick={handleGoogleSignIn}
                className="w-full h-12 text-base"
                variant="outline"
              >
                <Chrome className="mr-3 h-5 w-5" />
                Continuar con Google
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Al iniciar sesión, aceptas nuestros{" "}
                <a href="#" className="text-primary hover:underline">
                  términos de servicio
                </a>{" "}
                y{" "}
                <a href="#" className="text-primary hover:underline">
                  política de privacidad
                </a>
              </p>
            </div>

            {callbackUrl !== "/" && (
              <div className="text-center">
                <Button 
                  variant="ghost" 
                  onClick={() => router.push("/")}
                  className="text-sm"
                >
                  Volver al inicio
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>¿Necesitas ayuda? Contáctanos en soporte@mincommerce.com</p>
        </div>
      </div>
    </div>
  );
}

// Componente de loading para Suspense
function SignInLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Cargando...</span>
      </div>
    </div>
  );
}

// Componente principal que envuelve SignInContent en Suspense
export default function SignInPage() {
  return (
    <Suspense fallback={<SignInLoading />}>
      <SignInContent />
    </Suspense>
  );
}