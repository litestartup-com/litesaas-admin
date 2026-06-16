import { NextResponse } from "next/server"
import { lsVerifyCode } from "@/lib/ls-client"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, code } = body

    if (!email || !code) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Email and verification code are required",
          },
        },
        { status: 400 }
      )
    }

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
          message: error?.message || "An error occurred during verification",
        },
      },
      { status }
    )
  }
}
