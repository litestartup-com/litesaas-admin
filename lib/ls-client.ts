/**
 * T-LSS01 LS API Client
 *
 * Server-side client for communicating with the LiteStartup (LS) backend.
 * All calls are authenticated via the LS API Key (server-side only).
 * This module must NOT be imported in client-side code.
 */

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

export interface LSAuthResponse {
  user: {
    id: number
    email: string
    name: string | null
    avatar_url: string | null
    email_verified: boolean
  }
  access_token: string
  refresh_token: string
  expires_in: number
}

export interface LSUser {
  id: number
  email: string
  name: string | null
  avatar_url: string | null
  email_verified: boolean
  status: string
  oauth_provider: string | null
  created_at: string
}

export interface LSOAuthConfig {
  google: boolean
  github: boolean
}

export interface LSChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface LSChatResponse {
  id: string
  choices: Array<{
    message: {
      role: string
      content: string
    }
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// --------------------------------------------------------------------------
// Internal helpers
// --------------------------------------------------------------------------

function getConfig() {
  const apiUrl = process.env.LS_API_URL
  const apiKey = process.env.LS_API_KEY
  if (!apiUrl || !apiKey) {
    throw new Error("LS_API_URL and LS_API_KEY must be set in environment variables")
  }
  return { apiUrl, apiKey }
}

interface LSResponse<T = any> {
  code: number
  message: string
  data: T
}

async function lsFetch<T = any>(
  path: string,
  options: RequestInit = {},
  appToken?: string
): Promise<LSResponse<T>> {
  const { apiUrl, apiKey } = getConfig()
  const url = `${apiUrl}${path}`

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    ...(options.headers as Record<string, string>),
  }

  // Attach app_user JWT if provided
  if (appToken) {
    headers["X-App-Token"] = `Bearer ${appToken}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  })

  const json = await response.json()

  if (!response.ok || json.code >= 400) {
    const err = new Error(json.message || `LS API error: ${response.status}`)
      ; (err as any).status = json.code || response.status
      ; (err as any).lsResponse = json
    throw err
  }

  return json as LSResponse<T>
}

// --------------------------------------------------------------------------
// Auth endpoints (/client/v2/auth/app/*)
// --------------------------------------------------------------------------

export async function lsRegister(
  email: string,
  password: string,
  name?: string
): Promise<LSAuthResponse> {
  const res = await lsFetch<LSAuthResponse>("/client/v2/auth/app/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  })
  return res.data
}

export async function lsLogin(
  email: string,
  password: string
): Promise<LSAuthResponse> {
  const res = await lsFetch<LSAuthResponse>("/client/v2/auth/app/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
  return res.data
}

export async function lsRequestCode(email: string): Promise<void> {
  await lsFetch("/client/v2/auth/app/request-code", {
    method: "POST",
    body: JSON.stringify({ email }),
  })
}

export async function lsVerifyCode(
  email: string,
  code: string
): Promise<LSAuthResponse> {
  const res = await lsFetch<LSAuthResponse>("/client/v2/auth/app/verify-code", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  })
  return res.data
}

export async function lsForgotPassword(email: string): Promise<void> {
  await lsFetch("/client/v2/auth/app/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  })
}

export async function lsResetPassword(
  token: string,
  password: string
): Promise<void> {
  await lsFetch("/client/v2/auth/app/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  })
}

export async function lsRefreshToken(
  refreshToken: string
): Promise<LSAuthResponse> {
  const res = await lsFetch<LSAuthResponse>("/client/v2/auth/app/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
  return res.data
}

export async function lsGetUser(appToken: string): Promise<LSUser> {
  const res = await lsFetch<LSUser>(
    "/client/v2/auth/app/user",
    { method: "GET" },
    appToken
  )
  return res.data
}

export async function lsUpdateUser(
  appToken: string,
  data: { name?: string; avatar_url?: string }
): Promise<LSUser> {
  const res = await lsFetch<LSUser>(
    "/client/v2/auth/app/user",
    { method: "PUT", body: JSON.stringify(data) },
    appToken
  )
  return res.data
}

export async function lsLogout(appToken: string): Promise<void> {
  await lsFetch(
    "/client/v2/auth/app/logout",
    { method: "POST" },
    appToken
  )
}

export async function lsGetOAuthConfig(): Promise<LSOAuthConfig> {
  const res = await lsFetch<LSOAuthConfig>("/client/v2/auth/app/oauth-config", {
    method: "GET",
  })
  return res.data
}

export function lsGetOAuthUrl(provider: "google" | "github"): string {
  const { apiUrl, apiKey } = getConfig()
  // The LS backend will redirect the user through OAuth flow
  return `${apiUrl}/client/v2/auth/app/oauth/${provider}?api_key=${encodeURIComponent(apiKey)}`
}

export async function lsOAuthExchange(
  provider: string,
  code: string,
  redirectUri: string
): Promise<LSAuthResponse> {
  const res = await lsFetch<LSAuthResponse>("/client/v2/auth/app/oauth/exchange", {
    method: "POST",
    body: JSON.stringify({ provider, code, redirect_uri: redirectUri }),
  })
  return res.data
}

// --------------------------------------------------------------------------
// AI endpoints (proxied via API Key)
// --------------------------------------------------------------------------

export async function lsChatCompletion(
  messages: LSChatMessage[],
  model?: string
): Promise<LSChatResponse> {
  const res = await lsFetch<LSChatResponse>("/client/v2/ai/chat", {
    method: "POST",
    body: JSON.stringify({
      messages,
      model: model || "default",
    }),
  })
  return res.data
}
