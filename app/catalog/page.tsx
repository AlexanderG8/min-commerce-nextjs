import { ProductCard } from "@/components/product-card";
import { prisma } from "@/lib/prisma";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

function ProductSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[300px] w-full" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

async function ProductGrid() {
  const products = await prisma.product.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No hay productos disponibles.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          description={product.description}
          price={product.price}
          stock={product.stock}
          imageUrl={product.imageUrl}
        />
      ))}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Catálogo de Productos</h1>
      <Suspense fallback={
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array(8).fill(0).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      }>
        <ProductGrid />
      </Suspense>
    </div>
  );
}