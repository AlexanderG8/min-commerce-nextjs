"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu } from "lucide-react";
import { useCartStore } from "@/lib/store/store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.items);
  const [isMounted, setIsMounted] = useState(false);

  // Solo ejecutar en el cliente después del montaje
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calcular el total de items
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const routes = [
    { href: "/", label: "Inicio" },
    { href: "/catalog", label: "Catálogo" },
    { href: "/order", label: "Mis Pedidos" },
  ];

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold">MinCommerce</span>
        </Link>
        
        {/* Navegación para pantallas medianas y grandes */}
        <nav className="ml-auto hidden md:flex md:items-center md:gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === route.href
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {route.label}
            </Link>
          ))}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {isMounted && cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </Link>
        </nav>

        {/* Menú móvil */}
        <div className="ml-auto md:hidden">
          <Link href="/cart" className="mr-2">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {isMounted && cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="mt-8 flex flex-col gap-4">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname === route.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {route.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}