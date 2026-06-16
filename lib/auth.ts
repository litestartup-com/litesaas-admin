/**
 * T-LSS01 Auth token management
 *
 * Stores access_token + refresh_token from LS Auth App.
 * Access tokens are short-lived (1 h); refresh tokens last 7 d.
 * The refresh flow is handled by the Next.js API routes so the
 * LS API Key never reaches the browser.
 */

interface TokenData {
  accessToken: string
  refreshToken: string
  expiresAt: number // Unix timestamp in milliseconds
}

const TOKEN_KEY = "auth_tokens"

/**
 * Store both tokens after login / register / refresh
 */
export function setAuthTokens(
  accessToken: string,
  refreshToken: string,
  expiresIn: number = 3600
): void {
  if (typeof window === "undefined") return

  const tokenData: TokenData = {
    accessToken,
    refreshToken,
    expiresAt: Date.now() + expiresIn * 1000,
  }

  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData))
}

/**
 * Legacy compat — store a single access token (sets refresh to empty)
 */
export function setAuthToken(token: string): void {
  setAuthTokens(token, "", 3600)
}

/**
 * Get the access token if not expired
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null

  const stored = localStorage.getItem(TOKEN_KEY)
  if (!stored) return null

  try {
    const tokenData: TokenData = JSON.parse(stored)

    if (Date.now() >= tokenData.expiresAt) {
      // Access token expired — caller should attempt refresh
      return null
    }

    return tokenData.accessToken
  } catch {
    clearAuthToken()
    return null
  }
}

/**
 * Get the refresh token (regardless of access token expiry)
 */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null

  const stored = localStorage.getItem(TOKEN_KEY)
  if (!stored) return null

  try {
    const tokenData: TokenData = JSON.parse(stored)
    return tokenData.refreshToken || null
  } catch {
    return null
  }
}

/**
 * Check if user is authenticated (has valid access token)
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null
}

/**
 * Clear all auth tokens
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
