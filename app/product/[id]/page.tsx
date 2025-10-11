import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AddToCartButton } from "@/components/add-to-cart-button";

// Componente para cargar los detalles del producto
async function ProductDetails({ id }: { id: string }) {
  const productId = parseInt(id);
  
  if (isNaN(productId)) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-lg">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-muted-foreground">Sin imagen</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          {product.stock <= 5 && product.stock > 0 && (
            <Badge variant="outline" className="ml-2">
              ¡Últimas unidades!
            </Badge>
          )}
          {product.stock === 0 && (
            <Badge variant="destructive" className="ml-2">
              Agotado
            </Badge>
          )}
        </div>
        <p className="text-2xl font-semibold">${product.price.toFixed(2)}</p>
        <div className="prose max-w-none">
          <p>{product.description}</p>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            Disponibilidad: {product.stock > 0 ? `${product.stock} en stock` : "Agotado"}
          </p>
        </div>
        <AddToCartButton 
          productId={product.id} 
          productName={product.name}
          productPrice={product.price}
          productImage={product.imageUrl || ""}
          productStock={product.stock}
        />
      </div>
    </div>
  );
}

// Componente de carga
function ProductDetailsSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-8 w-1/4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-12 w-1/3 mt-6" />
      </div>
    </div>
  );
}

// Página principal - Modificada para usar await con params
export default async function ProductPage({ params }: { params: { id: string } }) {
  // Esperamos a que params esté disponible y extraemos el id
  const { id } = await params;
  
  return (
    <div className="container py-10">
      <Suspense fallback={<ProductDetailsSkeleton />}>
        <ProductDetails id={id} />
      </Suspense>
    </div>
  );
}