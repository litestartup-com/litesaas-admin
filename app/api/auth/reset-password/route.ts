import { NextResponse } from "next/server"
import { lsForgotPassword, lsResetPassword } from "@/lib/ls-client"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, token, password } = body

    // If token + password → complete the reset
    if (token && password) {
      await lsResetPassword(token, password)

      return NextResponse.json({
        success: true,
        data: {
          message: "Password has been reset successfully",
        },
      })
    }

    // Otherwise → request the reset email
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

    await lsForgotPassword(email)

    return NextResponse.json({
      success: true,
      data: {
        message: "Password reset link has been sent to your email",
      },
    })
  } catch (error: any) {
    const status = error?.status || 500
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error?.message || "An error occurred while sending reset link",
        },
      },
      { status }
    )
  }
}
