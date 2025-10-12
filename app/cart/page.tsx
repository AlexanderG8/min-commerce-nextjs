"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    setIsUpdating(true);
    updateQuantity(id, newQuantity);
    setTimeout(() => setIsUpdating(false), 300);
  };

  const handleRemoveItem = (id: number) => {
    removeItem(id);
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Carrito de Compras</h1>
        <div className="flex flex-col items-center justify-center py-12">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">Tu carrito está vacío</h2>
          <p className="text-muted-foreground mb-6">
            Parece que aún no has agregado productos a tu carrito
          </p>
          <Button asChild>
            <Link href="/catalog">Ver Catálogo</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Carrito de Compras</h1>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center p-4">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden mr-4">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <span className="text-xs text-muted-foreground">Sin imagen</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <Link href={`/product/${item.id}`} className="hover:underline">
                        <h3 className="font-medium">{item.name}</h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)} / unidad
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || isUpdating}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={isUpdating}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="ml-4 text-right">
                      <p className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-4 flex justify-between">
            <Button variant="outline" onClick={() => clearCart()}>
              Vaciar carrito
            </Button>
            <Button variant="outline" asChild>
              <Link href="/catalog">Seguir comprando</Link>
            </Button>
          </div>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span>Calculado en el checkout</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              
              <Button className="w-full mt-6" onClick={handleCheckout}>
                Proceder al checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}