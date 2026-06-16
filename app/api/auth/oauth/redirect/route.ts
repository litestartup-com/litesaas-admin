import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * GET /api/auth/oauth/redirect?provider=google|github
 * 
 * Returns the LS OAuth redirect URL for the given provider.
 * Frontend should navigate to this URL to start OAuth flow.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const provider = searchParams.get("provider")

  if (!provider || !["google", "github"].includes(provider)) {
    return NextResponse.json(
      { success: false, error: { message: "Invalid provider" } },
      { status: 400 }
    )
  }

  const lsApiUrl = process.env.LS_API_URL
  const lsApiKey = process.env.LS_API_KEY
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  if (!lsApiUrl || !lsApiKey) {
    return NextResponse.json(
      { success: false, error: { message: "OAuth not configured" } },
      { status: 500 }
    )
  }

  // The callback URL in our app that will receive tokens after OAuth
  const redirectUri = `${appUrl}/auth/oauth/callback`

  // Build LS OAuth redirect URL
  const oauthUrl = `${lsApiUrl}/client/v2/auth/app/oauth/${provider}?` +
    new URLSearchParams({
      redirect_uri: redirectUri,
    }).toString()

  // Server-side fetch to get the actual Google/GitHub auth URL from LS
  // Must use Authorization: Bearer format (AuthForWebMiddleware expects this)
  const response = await fetch(oauthUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${lsApiKey}`,
      Accept: "application/json",
    },
    redirect: "manual", // Don't follow redirects, capture the Location header
  })

  if (response.status === 302) {
    const location = response.headers.get("Location")
    if (location) {
      return NextResponse.json({ success: true, data: { url: location } })
    }
  }

  // If not a redirect, parse error
  const text = await response.text()
  let errorMessage = "OAuth initiation failed"
  try {
    const json = JSON.parse(text)
    errorMessage = json.message || errorMessage
  } catch { }

  return NextResponse.json(
    { success: false, error: { message: errorMessage } },
    { status: 400 }
  )
}
