"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
}

export function ProductCard({
  id,
  name,
  description,
  price,
  stock,
  imageUrl,
}: ProductCardProps) {
  const { addItem } = useCartStore();
  const router = useRouter();

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      imageUrl,
    });
    toast.success('Producto agregado al carrito', {
      description: name,
      action: {
        label: 'Ver carrito',
        onClick: () => router.push('/cart'),
      },
      icon: <ShoppingCart className="h-4 w-4" />,
    });
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link href={`/product/${id}`} className="block">
        <div className="aspect-square overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              width={300}
              height={300}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-muted-foreground">Sin imagen</span>
            </div>
          )}
        </div>
      </Link>
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <Link href={`/product/${id}`} className="block">
            <h3 className="font-medium line-clamp-1">{name}</h3>
          </Link>
          {stock <= 5 && stock > 0 && (
            <Badge variant="outline" className="ml-2">
              ¡Últimas unidades!
            </Badge>
          )}
          {stock === 0 && (
            <Badge variant="destructive" className="ml-2">
              Agotado
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <Link href={`/product/${id}`} className="block">
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          <p className="mt-2 font-medium">${price.toFixed(2)}</p>
        </Link>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart} 
          className="w-full"
          disabled={stock === 0}
        >
          {stock === 0 ? "Agotado" : "Agregar al carrito"}
        </Button>
      </CardFooter>
    </Card>
  );
}