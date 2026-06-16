"use client"

import { DashboardContent } from "./dashboard-content"
import { useEffect, useState } from "react"
import { fetchWithAuth } from "@/lib/fetch-with-auth"
import { DashboardStats, VisitorsResponse, ActivityItem } from "@/lib/api"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [visitors, setVisitors] = useState<VisitorsResponse | null>(null)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch initial data (auth is handled by AuthGuard in layout)
    const fetchData = async () => {
      try {
        const [statsRes, visitorsRes, activitiesRes] = await Promise.all([
          fetchWithAuth("/api/dashboard/stats"),
          fetchWithAuth("/api/dashboard/visitors?range=7d"),
          fetchWithAuth("/api/dashboard/activity"),
        ])

        if (statsRes.status === 401 || visitorsRes.status === 401 || activitiesRes.status === 401) {
          return
        }

        const statsData = await statsRes.json()
        const visitorsData = await visitorsRes.json()
        const activitiesData = await activitiesRes.json()

        if (statsData.success) setStats(statsData.data)
        if (visitorsData.success) setVisitors(visitorsData.data)
        if (activitiesData.success) setActivities(activitiesData.data)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading || !stats || !visitors) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <DashboardContent
      initialStats={stats}
      initialVisitors={visitors}
      initialActivities={activities}
    />
  )
}
