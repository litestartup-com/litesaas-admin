import { NextResponse } from "next/server"

// Mock profile data
const PROFILE_DATA = {
  email: "user@example.com",
  authentication: [
    {
      id: "email-password",
      type: "email",
      name: "Email & Password",
      email: "nemodingding@gmail.com",
      connectedAt: "2026-01-06",
      icon: "Mail",
      canDisconnect: true,
    },
    {
      id: "google",
      type: "google",
      name: "Google",
      email: "nemodingding@gmail.com",
      connectedAt: "2026-01-06",
      icon: "Chrome",
      canDisconnect: false,
    },
  ],
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function GET() {
  await delay(200)

  return NextResponse.json({
    success: true,
    data: PROFILE_DATA,
  })
}

export async function PUT(request: Request) {
  await delay(300)

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
          },
        },
        { status: 400 }
      )
    }

    // Mock: Update email in database
    return NextResponse.json({
      success: true,
      data: {
        ...PROFILE_DATA,
        email,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while updating profile",
        },
      },
      { status: 500 }
    )
  }
}
