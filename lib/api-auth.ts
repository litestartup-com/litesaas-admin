import { NextRequest, NextResponse } from "next/server"

/**
 * T-LSS01 Server-side API auth helpers
 *
 * Tokens are LS Auth App JWTs. The Next.js API routes act as a
 * proxy: the browser sends the access_token in the Authorization
 * header and the route forwards it to LS via X-App-Token.
 */

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
 * Basic structural check — real validation happens on the LS side
 * when the token is forwarded via X-App-Token.
 */
export function verifyToken(token: string): { valid: boolean; expired?: boolean } {
  if (!token || token.length === 0) {
    return { valid: false }
  }

  // LS Auth App issues standard JWT (header.payload.signature)
  const parts = token.split(".")
  if (parts.length !== 3) {
    return { valid: false }
  }

  // Optionally check exp claim client-side for fast rejection
  try {
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8")
    )
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return { valid: false, expired: true }
    }
  } catch {
    // If we can't decode, let LS do the final check
  }

  return { valid: true }
}

/**
 * Middleware to authenticate API requests
 */
export function authenticateRequest(request: NextRequest): {
  authenticated: boolean
  token?: string
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
            code: verification.expired ? "TOKEN_EXPIRED" : "UNAUTHORIZED",
            message: verification.expired
              ? "Token has expired. Please refresh."
              : "Invalid or expired token",
          },
        },
        { status: 401 }
      ),
    }
  }

  return { authenticated: true, token }
}
