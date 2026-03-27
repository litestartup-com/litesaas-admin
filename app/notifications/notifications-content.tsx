"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Check, X, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"
import { fetchWithAuth } from "@/lib/fetch-with-auth"

interface Notification {
  id: string
  title: string
  sender: string
  message: string
  link: string | null
  linkUrl: string | null
  read: boolean
  createdAt: string
  type: string
}

export function NotificationsContent() {
  const { t } = useTranslation()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10

  useEffect(() => {
    fetchNotifications()
  }, [typeFilter, statusFilter, page])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        type: typeFilter,
        status: statusFilter,
      })

      const response = await fetchWithAuth(`/api/notifications?${params}`)
      if (response.status === 401) return
      const result = await response.json()

      if (result.success) {
        const allNotifications = result.data
        const startIndex = (page - 1) * pageSize
        const endIndex = startIndex + pageSize
        setNotifications(allNotifications.slice(startIndex, endIndex))
        setTotal(allNotifications.length)
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetchWithAuth(`/api/notifications/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ read: true }),
      })
      if (response.status === 401) return

      const result = await response.json()

      if (result.success) {
        setNotifications(
          notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
        )
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetchWithAuth(`/api/notifications/${id}`, {
        method: "DELETE",
      })
      if (response.status === 401) return

      const result = await response.json()

      if (result.success) {
        setNotifications(notifications.filter((n) => n.id !== id))
        setTotal(total - 1)
      }
    } catch (error) {
      console.error("Failed to delete notification:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetchWithAuth("/api/notifications/mark-all-read", {
        method: "POST",
      })
      if (response.status === 401) return

      const result = await response.json()

      if (result.success) {
        setNotifications(notifications.map((n) => ({ ...n, read: true })))
        fetchNotifications()
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
        return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes} minutes ago`
      }
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
    } else if (diffInDays === 1) {
      return "1 day ago"
    } else {
      return `${diffInDays} days ago`
    }
  }

  const totalPages = Math.ceil(total / pageSize)
  const startIndex = (page - 1) * pageSize + 1
  const endIndex = Math.min(page * pageSize, total)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('notifications.title')}</h1>
          <p className="text-muted-foreground">
            {t('notifications.description')}
          </p>
        </div>
        <Button variant="link" onClick={handleMarkAllAsRead}>
          {t('notifications.markAllAsRead')}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t('notifications.allTypes')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('notifications.allTypes')}</SelectItem>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="billing">Billing</SelectItem>
            <SelectItem value="security">Security</SelectItem>
            <SelectItem value="team">Team</SelectItem>
            <SelectItem value="feature">Feature</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t('notifications.allStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('notifications.allStatus')}</SelectItem>
            <SelectItem value="unread">{t('notifications.unread')}</SelectItem>
            <SelectItem value="read">{t('notifications.read')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">{t('common.loading')}</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {t('notifications.noNotificationsFound')}
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Unread Indicator */}
                  {!notification.read && (
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {notification.sender}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm text-muted-foreground">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleMarkAsRead(notification.id)}
                          title={t('notifications.markAsRead')}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDelete(notification.id)}
                          title={t('notifications.delete')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm mb-2">{notification.message}</p>
                    {notification.link && notification.linkUrl && (
                      <Link
                        href={notification.linkUrl}
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      >
                        {notification.link}
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {t('notifications.showing')} {startIndex}-{endIndex} {t('notifications.of')} {total}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              {t('notifications.previous')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
            >
              {t('notifications.next')}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
