"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { useUser } from "@/store/use-user"

interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * AuthGuard component that redirects to login if user is not authenticated
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Allow access to auth pages without authentication
    const publicPaths = ["/login", "/signup", "/verify-email"]
    const isPublicPath = publicPaths.includes(pathname)

    if (isPublicPath) {
      // If already authenticated and trying to access auth pages, redirect to dashboard
      const authenticated = isAuthenticated()
      const hasUser = user !== null
      if (authenticated && hasUser) {
        router.push("/dashboard")
      }
      return
    }

    // Check authentication
    const authenticated = isAuthenticated()
    const hasUser = user !== null

    // If not authenticated or no user data, redirect to login
    if (!authenticated || !hasUser) {
      router.push("/login")
    }
  }, [mounted, pathname, router, user])

  // Don't render children until mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  // Allow public paths
  const publicPaths = ["/login", "/signup", "/verify-email"]
  const isPublicPath = publicPaths.includes(pathname)

  if (isPublicPath) {
    return <>{children}</>
  }

  // Check authentication
  const authenticated = isAuthenticated()
  const hasUser = user !== null

  // If not authenticated, don't render (will redirect)
  if (!authenticated || !hasUser) {
    return null
  }

  return <>{children}</>
}
