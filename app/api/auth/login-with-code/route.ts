import { NextResponse } from "next/server"
import { lsRequestCode, lsVerifyCode } from "@/lib/ls-client"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, code } = body

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

    // Step 1: If no code provided, request one
    if (!code) {
      await lsRequestCode(email)

      return NextResponse.json({
        success: true,
        data: {
          email,
          message: "Verification code sent to your email",
        },
      })
    }

    // Step 2: Verify code and login
    const result = await lsVerifyCode(email, code)

    return NextResponse.json({
      success: true,
      data: {
        user: result.user,
        token: result.access_token,
        refresh_token: result.refresh_token,
        expires_in: result.expires_in,
      },
    })
  } catch (error: any) {
    const status = error?.status || 500
    return NextResponse.json(
      {
        success: false,
        error: {
          code: status === 400 ? "INVALID_CODE" : "INTERNAL_ERROR",
          message: error?.message || "An error occurred during login",
        },
      },
      { status }
    )
  }
}
