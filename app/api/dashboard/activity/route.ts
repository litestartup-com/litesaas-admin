import { NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/api-auth"

// Mock activity data based on design
const mockActivityData = [
  {
    id: "1",
    type: "user_registered",
    icon: "Users",
    iconColor: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900",
    title: "New user registered",
    description: "john@example.com",
    timestamp: "2 minutes ago",
  },
  {
    id: "2",
    type: "payment_received",
    icon: "CreditCard",
    iconColor: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900",
    title: "Payment received",
    description: "Pro Plan - $29.00",
    timestamp: "15 minutes ago",
  },
  {
    id: "3",
    type: "plan_upgraded",
    icon: "TrendingUp",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-900",
    title: "Plan upgraded",
    description: "Free → Pro",
    timestamp: "1 hour ago",
  },
  {
    id: "4",
    type: "credits_purchased",
    icon: "DollarSign",
    iconColor: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900",
    title: "Credits purchased",
    description: "100 credits - $9.99",
    timestamp: "3 hours ago",
  },
  {
    id: "5",
    type: "failed_login",
    icon: "AlertTriangle",
    iconColor: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900",
    title: "Failed login attempt",
    description: "IP: 192.168.1.100",
    timestamp: "5 hours ago",
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function GET(request: NextRequest) {
  // Authenticate request
  const auth = authenticateRequest(request)
  if (!auth.authenticated) {
    return auth.response!
  }

  await delay(300)

  return NextResponse.json({
    success: true,
    data: mockActivityData,
  })
}
