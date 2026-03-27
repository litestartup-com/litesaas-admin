import { NextRequest, NextResponse } from "next/server"

/**
 * Extract token from Authorization header
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }
  return authHeader.substring(7)
}

/**
 * Verify token and check expiration
 * In production, this would verify JWT signature
 */
export function verifyToken(token: string): { valid: boolean; expired?: boolean } {
  // In a real app, you would:
  // 1. Verify JWT signature
  // 2. Check expiration from JWT payload
  // 3. Validate token structure
  
  // For mock implementation, we'll check if token exists and is not expired
  // The actual expiration is handled client-side in getAuthToken()
  // But we can add server-side validation here
  
  if (!token || token.length === 0) {
    return { valid: false }
  }

  // Mock: Check if token format is valid (starts with "mock-jwt-token")
  if (!token.startsWith("mock-jwt-token")) {
    return { valid: false }
  }

  // In production, decode JWT and check expiration
  // For now, we'll trust the client-side expiration check
  // But we can add server-side validation if needed
  
  return { valid: true }
}

/**
 * Middleware to authenticate API requests
 */
export function authenticateRequest(request: NextRequest): {
  authenticated: boolean
  response?: NextResponse
} {
  const token = getTokenFromRequest(request)

  if (!token) {
    return {
      authenticated: false,
      response: NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication token is required",
          },
        },
        { status: 401 }
      ),
    }
  }

  const verification = verifyToken(token)
  if (!verification.valid) {
    return {
      authenticated: false,
      response: NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Invalid or expired token",
          },
        },
        { status: 401 }
      ),
    }
  }

  return { authenticated: true }
}
