import { NextResponse } from "next/server"
import { lsRefreshToken } from "@/lib/ls-client"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { refresh_token } = body

    if (!refresh_token) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Refresh token is required",
          },
        },
        { status: 400 }
      )
    }

    const result = await lsRefreshToken(refresh_token)

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
          code: status === 401 ? "REFRESH_EXPIRED" : "INTERNAL_ERROR",
          message: error?.message || "An error occurred during token refresh",
        },
      },
      { status }
    )
  }
}
