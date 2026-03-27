"use client"

"use client"

import { ActivityItem } from "@/lib/api"
import { Users, CreditCard, TrendingUp, DollarSign, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  CreditCard,
  TrendingUp,
  DollarSign,
  AlertTriangle,
}

interface RecentActivityProps {
  activities: ActivityItem[]
  isLoading?: boolean
}

export function RecentActivity({ activities, isLoading = false }: RecentActivityProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
              <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = iconMap[activity.icon] || Users

        return (
          <div key={activity.id} className="flex items-center gap-3">
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center",
                activity.bgColor
              )}
            >
              <Icon className={cn("h-4 w-4", activity.iconColor)} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-xs text-muted-foreground">
                {activity.description} • {activity.timestamp}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
