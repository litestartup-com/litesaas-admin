import { NextResponse } from "next/server"

// Mock current plan
const CURRENT_PLAN = {
  id: "free",
  name: "Free",
  price: 0,
  period: null,
  status: "active",
  expiresAt: null,
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function GET() {
  await delay(200)

  return NextResponse.json({
    success: true,
    data: CURRENT_PLAN,
  })
}
