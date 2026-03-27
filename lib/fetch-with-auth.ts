import { getAuthToken, clearAuthToken } from "./auth"

/**
 * Fetch with automatic token injection and 401 handling
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken()

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Handle 401 - token expired or invalid
  if (response.status === 401) {
    clearAuthToken()
    // Clear user data
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
      // Redirect to login
      window.location.href = "/login"
    }
  }

  return response
}
