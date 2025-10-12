"use client"

import React from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Decimal } from "@prisma/client/runtime/library";

interface OrderItem {
  id: number;
  productId: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    imageUrl: string;
  };
}

interface Order {
  id: number;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  clientCity: string;
  clientPostalCode: string;
  clientPhone: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderConfirmationPage() {
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Usar params.id directamente desde useParams()
        const orderId = params?.id as string;
        
        if (!orderId) {
          setError("ID de orden no proporcionado");
          setLoading(false);
          return;
        }
        
        const response = await fetch(`/api/orders/${orderId}`);
        
        if (!response.ok) {
          throw new Error("No se pudo cargar la información de la orden");
        }
        
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError("Error al cargar los detalles de la orden");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 space-y-6">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto py-10">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || "No se encontró la orden solicitada"}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/")}>Volver al inicio</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold">¡Gracias por tu compra!</h1>
        <p className="text-muted-foreground">
          Tu pedido ha sido confirmado y está siendo procesado.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Orden #{order.id}</span>
            <span className="text-sm font-normal text-muted-foreground">
              {formattedDate}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Información de envío</h3>
            <div className="text-sm text-muted-foreground">
              <p>{order.clientName}</p>
              <p>{order.clientEmail}</p>
              <p>{order.clientAddress}</p>
              <p>{order.clientCity}, {order.clientPostalCode}</p>
              <p>{order.clientPhone}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Productos</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-md">
                    <Image
                      src={item.product.imageUrl || "https://placehold.co/200x200"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)} c/u
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <span className="font-medium">Total</span>
            <span className="font-bold text-xl">${order.total.toFixed(2)}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/")}>
            Volver a la tienda
          </Button>
          <Button onClick={() => window.print()}>
            Imprimir recibo
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}