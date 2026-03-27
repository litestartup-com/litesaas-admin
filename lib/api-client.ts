import { getAuthToken, clearAuthToken } from "./auth"

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any[]
  }
}

/**
 * API client with automatic token handling and 401 redirect
 */
export async function apiClient<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken()

  // Add token to headers if available
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      clearAuthToken()
      // Clear user data as well
      if (typeof window !== "undefined") {
        localStorage.removeItem("user")
      }
      // Redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
      return {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required. Please login again.",
        },
      }
    }

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || {
          code: "API_ERROR",
          message: data.message || "An error occurred",
        },
      }
    }

    return {
      success: true,
      data: data.data || data,
    }
  } catch (error) {
    console.error("API request failed:", error)
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: "Network error. Please check your connection.",
      },
    }
  }
}

/**
 * GET request
 */
export async function apiGet<T = any>(url: string): Promise<ApiResponse<T>> {
  return apiClient<T>(url, { method: "GET" })
}

/**
 * POST request
 */
export async function apiPost<T = any>(
  url: string,
  body?: any
): Promise<ApiResponse<T>> {
  return apiClient<T>(url, {
    method: "POST",
    body: JSON.stringify(body),
  })
}

/**
 * PUT request
 */
export async function apiPut<T = any>(
  url: string,
  body?: any
): Promise<ApiResponse<T>> {
  return apiClient<T>(url, {
    method: "PUT",
    body: JSON.stringify(body),
  })
}

/**
 * PATCH request
 */
export async function apiPatch<T = any>(
  url: string,
  body?: any
): Promise<ApiResponse<T>> {
  return apiClient<T>(url, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

/**
 * DELETE request
 */
export async function apiDelete<T = any>(
  url: string
): Promise<ApiResponse<T>> {
  return apiClient<T>(url, { method: "DELETE" })
}
