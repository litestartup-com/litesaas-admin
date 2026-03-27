"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  changeType?: "increase" | "decrease"
  icon: LucideIcon
  iconColor?: string
  isLoading?: boolean
}

export function StatsCard({
  title,
  value,
  change,
  changeType = "increase",
  icon: Icon,
  iconColor = "text-green-600 dark:text-green-400",
  isLoading = false,
}: StatsCardProps) {
  const formattedValue =
    typeof value === "number"
      ? value >= 1000
        ? `$${(value / 1000).toFixed(1)}K`
        : `$${value.toFixed(2)}`
      : value

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div
          className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center",
            iconColor.includes("green")
              ? "bg-green-100 dark:bg-green-900"
              : iconColor.includes("blue")
              ? "bg-blue-100 dark:bg-blue-900"
              : iconColor.includes("purple")
              ? "bg-purple-100 dark:bg-purple-900"
              : "bg-yellow-100 dark:bg-yellow-900"
          )}
        >
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{formattedValue}</div>
            {change !== undefined && (
              <p
                className={cn(
                  "text-xs mt-1",
                  changeType === "increase"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                )}
              >
                {changeType === "increase" ? "+" : "-"}
                {Math.abs(change)}% from last month
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
