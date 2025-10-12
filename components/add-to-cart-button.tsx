"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  productStock: number;
}

export function AddToCartButton({
  productId,
  productName,
  productPrice,
  productImage,
  productStock
}: AddToCartButtonProps) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    
    // Agregamos el producto al carrito
    addItem({
      id: productId,
      name: productName,
      price: productPrice,
      imageUrl: productImage,
    });
    
    // Mostramos el toast de confirmación
    toast.success('Producto agregado al carrito', {
      description: productName,
      action: {
        label: 'Ver carrito',
        onClick: () => router.push('/cart'),
      },
      icon: <ShoppingCart className="h-4 w-4" />,
    });
    
    // Reseteamos el estado después de un breve retraso
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  return (
    <Button 
      onClick={handleAddToCart} 
      size="lg" 
      className="mt-6"
      disabled={productStock === 0 || isAdding}
    >
      {productStock === 0 
        ? "Agotado" 
        : isAdding 
          ? "Agregando..." 
          : "Agregar al carrito"
      }
    </Button>
  );
}