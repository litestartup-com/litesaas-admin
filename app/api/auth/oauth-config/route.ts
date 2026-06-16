import { NextResponse } from "next/server"

const LS_API_URL = process.env.LS_API_URL || ""
const LS_API_KEY = process.env.LS_API_KEY || ""

/**
 * GET /api/auth/oauth-config
 * Returns which OAuth providers are enabled.
 */
export async function GET() {
  if (!LS_API_URL || !LS_API_KEY) {
    return NextResponse.json({
      success: true,
      data: { google: { enabled: false }, github: { enabled: false } },
    })
  }

  try {
    const response = await fetch(`${LS_API_URL}/client/v2/auth/app/oauth-config`, {
      headers: {
        Authorization: `Bearer ${LS_API_KEY}`,
        Accept: "application/json",
      },
      cache: "no-store",
    })

    const json = await response.json()

    if (response.ok && json.data) {
      return NextResponse.json({ success: true, data: json.data })
    }

    return NextResponse.json({
      success: true,
      data: { google: { enabled: false }, github: { enabled: false } },
    })
  } catch {
    return NextResponse.json({
      success: true,
      data: { google: { enabled: false }, github: { enabled: false } },
    })
  }
}
