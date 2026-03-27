import { NextResponse } from "next/server"

// Mock user credentials
const MOCK_USER = {
  email: "user@example.com",
  password: "password123",
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function POST(request: Request) {
  await delay(500)

  try {
    const body = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Email and password are required",
            details: [
              !email && { field: "email", message: "Email is required" },
              !password && { field: "password", message: "Password is required" },
            ].filter(Boolean),
          },
        },
        { status: 400 }
      )
    }

    // Check credentials
    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      // Generate a mock token (in production, use a proper JWT library)
      const token = `mock-jwt-token-${Date.now()}-${Math.random().toString(36).substring(7)}`
      
      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: "1",
            email: MOCK_USER.email,
            name: "User",
          },
          token: token,
        },
      })
    }

    // Invalid credentials
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
          details: [
            { field: "email", message: "Invalid email or password" },
            { field: "password", message: "Invalid email or password" },
          ],
        },
      },
      { status: 401 }
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
