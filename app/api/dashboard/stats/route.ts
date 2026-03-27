import { NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/api-auth"

// Mock data for dashboard statistics
const mockStats = {
  totalRevenue: {
    value: 45231.81,
    change: 20.1,
    changeType: "increase" as const,
  },
  newCustomers: {
    value: 2400,
    change: 180.1,
    changeType: "increase" as const,
  },
  activeAccounts: {
    value: 12200,
    change: 19,
    changeType: "increase" as const,
  },
  growthRate: {
    value: 5.73,
    change: 2.1,
    changeType: "increase" as const,
  },
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function GET(request: NextRequest) {
  // Authenticate request
  const auth = authenticateRequest(request)
  if (!auth.authenticated) {
    return auth.response!
  }

  // Simulate network delay
  await delay(500)

  return NextResponse.json({
    success: true,
    data: mockStats,
  })
}
