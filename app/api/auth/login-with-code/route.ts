import { NextResponse } from "next/server"

// Mock verification code (same as verify-email)
const MOCK_VERIFICATION_CODE = "12345"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function POST(request: Request) {
  await delay(500)

  try {
    const body = await request.json()
    const { email, code } = body

    // Validation
    if (!email || !code) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Email and verification code are required",
            details: [
              !email && { field: "email", message: "Email is required" },
              !code && { field: "code", message: "Verification code is required" },
            ].filter(Boolean),
          },
        },
        { status: 400 }
      )
    }

    // Check verification code
    if (code === MOCK_VERIFICATION_CODE) {
      // Generate a mock token (in production, use a proper JWT library)
      const token = `mock-jwt-token-${Date.now()}-${Math.random().toString(36).substring(7)}`
      
      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: "1",
            email,
            name: "User",
          },
          token: token,
        },
      })
    }

    // Invalid code
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_CODE",
          message: "Invalid verification code",
          details: [{ field: "code", message: "The verification code is incorrect" }],
        },
      },
      { status: 400 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred during login",
        },
      },
      { status: 500 }
    )
  }
}
