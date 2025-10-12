"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCartStore } from "@/lib/store/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

// Esquema de validación para el formulario
const checkoutSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  city: z.string().min(2, "La ciudad debe tener al menos 2 caracteres"),
  postalCode: z.string().min(5, "El código postal debe tener al menos 5 caracteres"),
  phone: z.string().min(8, "El teléfono debe tener al menos 8 caracteres"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  // Efecto para manejar la redirección después de una compra exitosa
  useEffect(() => {
    if (orderSuccess && orderId) {
      router.push(`/order/confirmation/${orderId}`);
    }
  }, [orderSuccess, orderId, router]);
   // Efecto para redirigir si el carrito está vacío (solo si no es después de una compra exitosa)
  useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      router.push("/cart");
    }
  }, [items.length, orderSuccess, router]);

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Preparar los datos del pedido
      const orderData = {
        clientName: data.name,
        clientEmail: data.email,
        clientAddress: data.address,
        clientCity: data.city,
        clientPostalCode: data.postalCode,
        clientPhone: data.phone,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total: getTotalPrice()
      };
      // Enviar el pedido a la API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al procesar el pedido');
      }

      const result = await response.json();
      // Marcar la orden como existosa y guardar el ID
      setOrderSuccess(true);
      setOrderId(result.id);
      // Limpiar el carrito después de una compra exitosa
      clearCart();
      // Redirigir a la página de confirmación
      router.push(`/order/confirmation/${result.id}`);
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      setSubmitError(error instanceof Error ? error.message : 'Error al procesar el pedido');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Información de envío</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Nombre completo"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="tu@email.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    {...register("address")}
                    placeholder="Calle y número"
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address.message}</p>
                  )}
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      {...register("city")}
                      placeholder="Ciudad"
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive">{errors.city.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Código postal</Label>
                    <Input
                      id="postalCode"
                      {...register("postalCode")}
                      placeholder="Código postal"
                    />
                    {errors.postalCode && (
                      <p className="text-sm text-destructive">{errors.postalCode.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="Teléfono de contacto"
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>
                
                {submitError && (
                  <div className="p-3 bg-destructive/10 text-destructive rounded-md">
                    {submitError}
                  </div>
                )}
                
                <div className="pt-4">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      "Completar pedido"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span>Gratis</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}