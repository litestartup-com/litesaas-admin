"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { setAuthTokens } from "@/lib/auth"
import { useUser } from "@/store/use-user"
import { fetchWithAuth } from "@/lib/fetch-with-auth"

export default function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser } = useUser()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const accessToken = searchParams.get("access_token")
    const refreshToken = searchParams.get("refresh_token")
    const expiresIn = searchParams.get("expires_in")
    const errorParam = searchParams.get("error")

    if (errorParam) {
      setError(getErrorMessage(errorParam))
      return
    }

    if (!accessToken) {
      setError("No access token received from OAuth provider")
      return
    }

    // Store tokens
    setAuthTokens(
      accessToken,
      refreshToken || "",
      expiresIn ? parseInt(expiresIn) : 3600
    )

    // Fetch user info using the token
    fetchUserInfo(accessToken)
  }, [searchParams])

  const fetchUserInfo = async (token: string) => {
    try {
      const response = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          setUser(result.data)
        }
      }

      // Navigate to dashboard regardless
      router.push("/dashboard")
    } catch {
      // Even if profile fetch fails, we have the token, go to dashboard
      router.push("/dashboard")
    }
  }

  const getErrorMessage = (code: string) => {
    switch (code) {
      case "oauth_failed":
        return "Failed to authenticate with the provider. Please try again."
      case "account_suspended":
        return "Your account has been suspended."
      case "oauth_error":
        return "An error occurred during authentication. Please try again."
      default:
        return "Authentication failed. Please try again."
    }
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive">
            {error}
          </div>
          <button
            onClick={() => router.push("/login")}
            className="text-sm text-primary hover:underline"
          >
            Back to login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-sm text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  )
}
