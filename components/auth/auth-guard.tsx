"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getAuthToken } from "@/lib/auth"
import { useUser } from "@/store/use-user"

const PUBLIC_PATHS = ["/login", "/signup", "/verify-email", "/forgot-password", "/reset-password", "/auth/oauth/callback"]

interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * AuthGuard component that redirects to login if user is not authenticated.
 * Handles hydration by syncing localStorage → zustand on mount.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, setUser } = useUser()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // On mount (client only): ensure zustand user is in sync with localStorage
    if (typeof window === "undefined") return

    if (!user) {
      const stored = localStorage.getItem("user")
      if (stored) {
        try {
          setUser(JSON.parse(stored))
        } catch {
          // corrupted — clear it
          localStorage.removeItem("user")
        }
      }
    }
    setReady(true)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!ready) return

    const isPublicPath = PUBLIC_PATHS.includes(pathname)
    const authenticated = getAuthToken() !== null
    const hasUser = localStorage.getItem("user") !== null

    if (isPublicPath) {
      if (authenticated && hasUser) {
        router.replace("/dashboard")
      }
      return
    }

    if (!authenticated || !hasUser) {
      router.replace("/login")
    }
  }, [ready, pathname, router])

  // Don't render anything until client has mounted and checked auth
  if (!ready) {
    return null
  }

  const isPublicPath = PUBLIC_PATHS.includes(pathname)
  if (isPublicPath) {
    return <>{children}</>
  }

  // Final sync check — use localStorage directly (source of truth)
  const authenticated = getAuthToken() !== null
  const hasUser = localStorage.getItem("user") !== null

  if (!authenticated || !hasUser) {
    return null
  }

  return <>{children}</>
}
