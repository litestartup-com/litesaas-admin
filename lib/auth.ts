interface TokenData {
  token: string
  expiresAt: number // Unix timestamp in milliseconds
}

const TOKEN_KEY = "auth_token"
const TOKEN_EXPIRY_HOURS = 1

/**
 * Store authentication token with expiration
 */
export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return

  const expiresAt = Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000
  const tokenData: TokenData = {
    token,
    expiresAt,
  }

  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData))
}

/**
 * Get authentication token if valid
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null

  const stored = localStorage.getItem(TOKEN_KEY)
  if (!stored) return null

  try {
    const tokenData: TokenData = JSON.parse(stored)

    // Check if token is expired
    if (Date.now() >= tokenData.expiresAt) {
      // Token expired, remove it
      clearAuthToken()
      return null
    }

    return tokenData.token
  } catch {
    // Invalid token data, remove it
    clearAuthToken()
    return null
  }
}

/**
 * Check if user is authenticated (has valid token)
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null
}

/**
 * Clear authentication token
 */
export function clearAuthToken(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * Get token expiration time
 */
export function getTokenExpiration(): number | null {
  if (typeof window === "undefined") return null

  const stored = localStorage.getItem(TOKEN_KEY)
  if (!stored) return null

  try {
    const tokenData: TokenData = JSON.parse(stored)
    return tokenData.expiresAt
  } catch {
    return null
  }
}
