import { getAuthToken, getRefreshToken, setAuthTokens, clearAuthToken } from "./auth"

/**
 * T-LSS01 Fetch with automatic token injection and refresh flow
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  let token = getAuthToken()

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  let response = await fetch(url, {
    ...options,
    headers,
  })

  // Handle 401 - attempt token refresh
  if (response.status === 401) {
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      try {
        const refreshRes = await fetch("/api/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        })

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json()
          if (refreshData.success && refreshData.data) {
            setAuthTokens(
              refreshData.data.token,
              refreshData.data.refresh_token,
              refreshData.data.expires_in
            )

            // Retry original request with new token
            headers["Authorization"] = `Bearer ${refreshData.data.token}`
            response = await fetch(url, { ...options, headers })
            return response
          }
        }
      } catch {
        // Refresh failed — fall through to logout
      }
    }

    // Refresh failed or no refresh token
    clearAuthToken()
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
  }

  return response
}
