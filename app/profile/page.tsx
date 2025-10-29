import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Calendar, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { ActivityLog, ActivityDisplayItem } from "@/types/activity";
import { getUserRecentActivities, getUserStatistics } from "@/lib/activity-logger";

// Función para formatear las actividades para mostrar
function formatActivities(activities: ActivityLog[]): ActivityDisplayItem[] {
  return activities.map(activity => {
    const timeAgo = getTimeAgo(new Date(activity.createdAt));
    
    switch (activity.action) {
      case 'LOGIN':
        return {
          id: activity.id,
          title: 'Sesión iniciada',
          description: activity.description,
          time: timeAgo,
          type: 'login' as const,
          metadata: activity.metadata
        };
      case 'ORDER_CREATED':
        return {
          id: activity.id,
          title: 'Pedido realizado',
          description: activity.description,
          time: timeAgo,
          type: 'order' as const,
          metadata: activity.metadata
        };
      default:
        return {
          id: activity.id,
          title: 'Actividad',
          description: activity.description,
          time: timeAgo,
          type: 'login' as const,
          metadata: activity.metadata
        };
    }
  });
}

// Función para calcular tiempo transcurrido
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Hace unos momentos';
  if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
  if (diffInSeconds < 2592000) return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
  return date.toLocaleDateString('es-ES');
}

export default async function Profile() {
  const session = await auth();
  console.log(session?.user?.role)
  
  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Acceso Requerido</CardTitle>
            <CardDescription>
              Debes iniciar sesión para ver tu perfil
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/">
              <Button>Volver al Inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Obtener datos del usuario autenticado
  const [activities, statistics] = await Promise.all([
    getUserRecentActivities(parseInt(session.user.id), 5),
    getUserStatistics(parseInt(session.user.id))
  ]);

  const formattedActivities = formatActivities(activities);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header del Perfil */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona tu información persona
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Información Personal */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Información Personal</CardTitle>
                    <CardDescription>
                      Detalles de tu cuenta y perfil
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    Nombre completo
                  </div>
                  <p className="font-medium">{session.user?.name || "No disponible"}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    Correo electrónico
                  </div>
                  <p className="font-medium">{session.user?.email || "No disponible"}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Miembro desde
                </div>
                <p className="font-medium">
                  {new Date().toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Cuenta Activa
                </Badge>
                <Badge variant="outline">Usuario Verificado</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Actividad Reciente */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle>Actividad Reciente</CardTitle>
                  <CardDescription>
                    Tus últimas acciones en la plataforma
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="max-h-50 overflow-y-auto">
              <div className="space-y-4">
                {formattedActivities.length > 0 ? (
                  formattedActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === 'login' 
                            ? 'bg-green-500/10' 
                            : 'bg-blue-500/10'
                        }`}>
                          <ShoppingBag className={`h-4 w-4 ${
                            activity.type === 'login' 
                              ? 'text-green-500' 
                              : 'text-blue-500'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                          {activity.metadata?.orderTotal && (
                            <p className="text-xs text-blue-600 font-medium">
                              Total: ${activity.metadata.orderTotal.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {activity.type === 'login' ? 'Login' : 'Pedido'}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      No hay actividad reciente
                    </p>
                    <Link href="/catalog">
                      <Button variant="outline" size="sm" className="mt-2">
                        Explorar Catálogo
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Acciones Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/order" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Mis Pedidos
                </Button>
              </Link>
              <Link href="/cart" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Ver Carrito
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">{statistics.totalOrders}</div>
                <p className="text-sm text-muted-foreground">Pedidos Realizados</p>
              </div>
              <div className="text-center p-4 bg-green-500/5 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  ${statistics.totalSpent.toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground">Total Gastado</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}