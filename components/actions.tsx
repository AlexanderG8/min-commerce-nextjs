"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

export function OrderActions() {
  const router = useRouter();
  
  return (
    <CardFooter className="flex justify-between">
      <Button variant="outline" onClick={() => router.push("/")}>
        Volver a la tienda
      </Button>
      <Button onClick={() => window.print()}>
        Imprimir recibo
      </Button>
    </CardFooter>
  );
}