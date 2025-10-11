import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MinCommerce - Tu tienda online minimalista",
  description: "Una tienda online minimalista con todo lo que necesitas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t py-6 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-center text-sm text-muted-foreground md:text-left">
                © 2025 MinCommerce. Desarrollador por <a href="https://linksxander.netlify.app/" className="text-sm text-muted-foreground hover:text-foreground">Alexander Gomez</a>.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Términos
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacidad
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Contacto
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}