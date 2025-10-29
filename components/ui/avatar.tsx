"use client"

import * as React from "react"
import { User } from "lucide-react"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  fallback?: React.ReactNode
  size?: "sm" | "md" | "lg"
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "md", ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false)
    const [imageLoaded, setImageLoaded] = React.useState(false)

    const sizeClasses = {
      sm: "w-8 h-8",
      md: "w-12 h-12", 
      lg: "w-16 h-16"
    }

    const iconSizes = {
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8"
    }

    React.useEffect(() => {
      setImageError(false)
      setImageLoaded(false)
    }, [src])

    const handleImageError = () => {
      setImageError(true)
    }

    const handleImageLoad = () => {
      setImageLoaded(true)
    }

    const showFallback = !src || imageError || !imageLoaded

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full bg-primary/10",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src && !imageError && (
          <img
            src={src}
            alt={alt || "Avatar"}
            className={cn(
              "aspect-square h-full w-full object-cover transition-opacity duration-200",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )}
        
        {showFallback && (
          <div className="flex h-full w-full items-center justify-center">
            {fallback || <User className={cn("text-primary", iconSizes[size])} />}
          </div>
        )}
      </div>
    )
  }
)

Avatar.displayName = "Avatar"

export { Avatar }