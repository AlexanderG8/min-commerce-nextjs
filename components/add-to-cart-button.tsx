"use client";

import { useCartStore } from "@/lib/store/store";
import { Button } from "@/components/ui/button";

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
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem({
      id: productId,
      name: productName,
      price: productPrice,
      imageUrl: productImage,
    });
  };

  return (
    <Button 
      onClick={handleAddToCart} 
      size="lg" 
      className="mt-6"
      disabled={productStock === 0}
    >
      {productStock === 0 ? "Agotado" : "Agregar al carrito"}
    </Button>
  );
}