import { NextResponse } from "next/server"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function POST(request: Request) {
  await delay(500)

  try {
    const body = await request.json()
    const { email } = body

    // Validation
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Email is required",
            details: [{ field: "email", message: "Email is required" }],
          },
        },
        { status: 400 }
      )
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid email format",
            details: [{ field: "email", message: "Please enter a valid email address" }],
          },
        },
        { status: 400 }
      )
    }

    // Mock: Use fixed verification code for testing
    // In real app, generate and send via email
    const verificationCode = "12345"

    return NextResponse.json({
      success: true,
      data: {
        email,
        verificationCode, // In real app, this would be sent via email
        message: "Verification code sent to your email",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred during signup",
        },
      },
      { status: 500 }
    )
  }
}
