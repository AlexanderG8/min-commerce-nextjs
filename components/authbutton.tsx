"use client"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, LogOut, LogIn } from "lucide-react";
import { useEffect, useState } from "react";

export default function AuthButton() {
  const { data: session } = useSession()
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Mostrar un placeholder durante la hidratación
  if (!isMounted) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        disabled
        className="flex items-center gap-2"
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">...</span>
      </Button>
    )
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/profile">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{session.user?.name}</span>
          </Button>
        </Link>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => signOut()}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </Button>
      </div>
    )
  }

  return (
    <Button 
      variant="default" 
      size="sm" 
      onClick={() => router.push('/signin?callbackUrl=/profile')}
      className="flex items-center gap-2"
    >
      <LogIn className="h-4 w-4" />
      <span className="hidden sm:inline">Iniciar Sesión</span>
    </Button>
  )
}