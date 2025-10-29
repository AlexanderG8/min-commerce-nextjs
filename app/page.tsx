import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Truck, ShieldCheck, Star } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Bienvenido a MinCommerce
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Tu tienda online minimalista con todo lo que necesitas
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/catalog">
                <Button size="lg" className="gap-1">
                  Ver Catálogo <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="outline" size="lg">
                  Ver Carrito
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Características
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Descubre por qué MinCommerce es la mejor opción para tu compra online
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
              <Card>
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Envío Rápido</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Recibe tus productos en tiempo récord con nuestro servicio de envío premium
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <div className="rounded-full bg-primary/10 p-3">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Pago Seguro</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Tus transacciones están protegidas con los más altos estándares de seguridad
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Calidad Garantizada</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Todos nuestros productos son de alta calidad y cuentan con garantía
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                ¿Listo para comprar?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                Explora nuestro catálogo y encuentra los mejores productos al mejor precio
              </p>
            </div>
            <Link href="/catalog">
              <Button size="lg" className="gap-1">
                Ir al Catálogo <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}