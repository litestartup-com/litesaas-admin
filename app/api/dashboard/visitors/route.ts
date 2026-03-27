import { NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/api-auth"

// Mock visitor data based on design (7 days)
const mockVisitorsData = {
  "7d": [
    { date: "Wed", visitors: 1200 },
    { date: "Thu", visitors: 1900 },
    { date: "Fri", visitors: 750 },
    { date: "Sat", visitors: 1100 },
    { date: "Sun", visitors: 1400 },
    { date: "Mon", visitors: 1800 },
    { date: "Tue", visitors: 1600 },
  ],
  "30d": Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { weekday: "short" }),
    visitors: Math.floor(Math.random() * 1500) + 600,
  })),
  "3m": Array.from({ length: 90 }, (_, i) => ({
    date: new Date(Date.now() - (89 - i) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    visitors: Math.floor(Math.random() * 1500) + 600,
  })),
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function GET(request: NextRequest) {
  // Authenticate request
  const auth = authenticateRequest(request)
  if (!auth.authenticated) {
    return auth.response!
  }

  await delay(300)
  
  const { searchParams } = new URL(request.url)
  const range = searchParams.get("range") || "7d"

  const data = mockVisitorsData[range as keyof typeof mockVisitorsData] || mockVisitorsData["7d"]

  return NextResponse.json({
    success: true,
    data: {
      range,
      visitors: data,
    },
  })
}
