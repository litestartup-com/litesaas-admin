import { NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/api-auth"
import { lsGetUser, lsUpdateUser } from "@/lib/ls-client"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const auth = authenticateRequest(request)
    if (!auth.authenticated) {
      return auth.response!
    }

    const user = await lsGetUser(auth.token!)

    return NextResponse.json({
      success: true,
      data: {
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        email_verified: user.email_verified,
        oauth_provider: user.oauth_provider,
        created_at: user.created_at,
      },
    })
  } catch (error: any) {
    const status = error?.status || 500
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error?.message || "An error occurred while fetching profile",
        },
      },
      { status }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = authenticateRequest(request)
    if (!auth.authenticated) {
      return auth.response!
    }

    const body = await request.json()
    const { name, avatar_url } = body

    const user = await lsUpdateUser(auth.token!, { name, avatar_url })

    return NextResponse.json({
      success: true,
      data: {
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        email_verified: user.email_verified,
      },
    })
  } catch (error: any) {
    const status = error?.status || 500
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error?.message || "An error occurred while updating profile",
        },
      },
      { status }
    )
  }
}
