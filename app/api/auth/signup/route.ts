import { NextResponse } from "next/server"
import { lsRegister, lsRequestCode } from "@/lib/ls-client"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name } = body

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

    // If password provided → full register; else → request verification code
    if (password) {
      const result = await lsRegister(email, password, name)

      return NextResponse.json({
        success: true,
        data: {
          user: result.user,
          token: result.access_token,
          refresh_token: result.refresh_token,
          expires_in: result.expires_in,
        },
      })
    }

    // No password — send verification code for email-first signup
    await lsRequestCode(email)

    return NextResponse.json({
      success: true,
      data: {
        email,
        message: "Verification code sent to your email",
      },
    })
  } catch (error: any) {
    console.error("[signup] error:", error?.message, error?.lsResponse || "")
    const status = error?.status || 500
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error?.message || "An error occurred during signup",
        },
      },
      { status }
    )
  }
}
