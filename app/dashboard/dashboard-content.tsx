"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw, DollarSign, Users, UserCheck, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCard } from "@/components/dashboard/stats-card"
import { VisitorsChart } from "@/components/dashboard/visitors-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import {
  DashboardStats,
  VisitorsResponse,
  ActivityItem,
} from "@/lib/api"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"
import { fetchWithAuth } from "@/lib/fetch-with-auth"

interface DashboardContentProps {
  initialStats: DashboardStats
  initialVisitors: VisitorsResponse
  initialActivities: ActivityItem[]
}

export function DashboardContent({
  initialStats,
  initialVisitors,
  initialActivities,
}: DashboardContentProps) {
  const { t } = useTranslation()
  const [stats, setStats] = useState(initialStats)
  const [visitors, setVisitors] = useState(initialVisitors)
  const [activities, setActivities] = useState(initialActivities)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedRange, setSelectedRange] = useState("7d")

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const [statsResponse, visitorsResponse, activitiesResponse] = await Promise.all([
        fetchWithAuth("/api/dashboard/stats"),
        fetchWithAuth(`/api/dashboard/visitors?range=${selectedRange}`),
        fetchWithAuth("/api/dashboard/activity"),
      ])
      
      if (statsResponse.status === 401 || visitorsResponse.status === 401 || activitiesResponse.status === 401) {
        return
      }

      const statsResult = await statsResponse.json()
      const visitorsResult = await visitorsResponse.json()
      const activitiesResult = await activitiesResponse.json()

      if (statsResult.success) {
        setStats(statsResult.data)
      }
      if (visitorsResult.success) {
        setVisitors(visitorsResult.data)
      }
      if (activitiesResult.success) {
        setActivities(activitiesResult.data)
      }
    } catch (error) {
      console.error("Failed to refresh data:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleRangeChange = async (range: string) => {
    setSelectedRange(range)
    try {
      const response = await fetchWithAuth(`/api/dashboard/visitors?range=${range}`)
      if (response.status === 401) return
      const result = await response.json()
      
      if (result.success) {
        setVisitors(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch visitors data:", error)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    if (value >= 1000) {
      return `+${(value / 1000).toFixed(1)}K`
    }
    return `+${value}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard.welcomeBack')}</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={cn("h-4 w-4", isRefreshing && "animate-spin")}
          />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t('dashboard.totalRevenue')}
          value={formatCurrency(stats.totalRevenue.value)}
          change={stats.totalRevenue.change}
          changeType={stats.totalRevenue.changeType}
          icon={DollarSign}
          iconColor="text-green-600 dark:text-green-400"
        />

        <StatsCard
          title={t('dashboard.newCustomers')}
          value={formatNumber(stats.newCustomers.value)}
          change={stats.newCustomers.change}
          changeType={stats.newCustomers.changeType}
          icon={Users}
          iconColor="text-blue-600 dark:text-blue-400"
        />

        <StatsCard
          title={t('dashboard.activeAccounts')}
          value={`${(stats.activeAccounts.value / 1000).toFixed(1)}K`}
          change={stats.activeAccounts.change}
          changeType={stats.activeAccounts.changeType}
          icon={UserCheck}
          iconColor="text-purple-600 dark:text-purple-400"
        />

        <StatsCard
          title={t('dashboard.growthRate')}
          value={`${stats.growthRate.value.toFixed(2)}%`}
          change={stats.growthRate.change}
          changeType={stats.growthRate.changeType}
          icon={TrendingUp}
          iconColor="text-yellow-600 dark:text-yellow-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-6 items-start">
        {/* Visitors Overview */}
        <Card className="lg:col-span-2 rounded-xl border border-border bg-card p-4 md:p-5">
          <CardHeader>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-0.5">
                <CardTitle>{t('dashboard.visitorsOverview')}</CardTitle>
                <CardDescription>Daily visitor statistics</CardDescription>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant={selectedRange === "7d" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleRangeChange("7d")}
                >
                  7 Days
                </Button>
                <Button
                  variant={selectedRange === "30d" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleRangeChange("30d")}
                >
                  30 Days
                </Button>
                <Button
                  variant={selectedRange === "3m" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleRangeChange("3m")}
                >
                  3 Months
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <VisitorsChart data={visitors.visitors} />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="rounded-xl border border-border bg-card p-4 md:p-5 mt-2 md:mt-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
              <Button variant="ghost" size="sm">{t('dashboard.viewAll')}</Button>
            </div>
          </CardHeader>
          <CardContent>
            <RecentActivity activities={activities} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
