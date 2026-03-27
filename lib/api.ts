/**
 * API client utilities for fetching data
 */

const API_BASE_URL =
  typeof window !== "undefined"
    ? "" // Client-side: use relative URLs
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000" // Server-side: use absolute URL

export async function fetchDashboardStats() {
  try {
    const url = `${API_BASE_URL}/api/dashboard/stats`
    const response = await fetch(url, {
      cache: "no-store", // Always fetch fresh data
    })

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard stats")
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    throw error
  }
}

export type DashboardStats = {
  totalRevenue: {
    value: number
    change: number
    changeType: "increase" | "decrease"
  }
  newCustomers: {
    value: number
    change: number
    changeType: "increase" | "decrease"
  }
  activeAccounts: {
    value: number
    change: number
    changeType: "increase" | "decrease"
  }
  growthRate: {
    value: number
    change: number
    changeType: "increase" | "decrease"
  }
}

export type VisitorData = {
  date: string
  visitors: number
}

export type VisitorsResponse = {
  range: string
  visitors: VisitorData[]
}

export type ActivityItem = {
  id: string
  type: string
  icon: string
  iconColor: string
  bgColor: string
  title: string
  description: string
  timestamp: string
}

export async function fetchVisitors(range: string = "7d") {
  try {
    const url = `${API_BASE_URL}/api/dashboard/visitors?range=${range}`
    const response = await fetch(url, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch visitors data")
    }

    const result = await response.json()
    return result.data as VisitorsResponse
  } catch (error) {
    console.error("Error fetching visitors data:", error)
    throw error
  }
}

export async function fetchRecentActivity() {
  try {
    const url = `${API_BASE_URL}/api/dashboard/activity`
    const response = await fetch(url, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch recent activity")
    }

    const result = await response.json()
    return result.data as ActivityItem[]
  } catch (error) {
    console.error("Error fetching recent activity:", error)
    throw error
  }
}
