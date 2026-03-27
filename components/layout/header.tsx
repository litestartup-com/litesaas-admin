"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { MessageCircle, FileText, HelpCircle, Bell, Moon, Sun, ArrowUpRight, Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LanguageSwitcher } from "./language-switcher"
import { useTranslation } from "@/lib/i18n"
import { useUser } from "@/store/use-user"
import { fetchWithAuth } from "@/lib/fetch-with-auth"
import { useUI } from "@/store/use-ui"

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

export function Header() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { t } = useTranslation()
  const { user } = useUser()
  const { sidebarOpen, setSidebarOpen } = useUI()
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [totalNotifications, setTotalNotifications] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchNotifications()
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetchWithAuth("/api/notifications?limit=5")
      if (response.status === 401) return
      const result = await response.json()

      if (result.success) {
        setNotifications(result.data)
        setUnreadCount(result.unread)
        setTotalNotifications(result.total)
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetchWithAuth("/api/notifications/mark-all-read", {
        method: "POST",
      })
      if (response.status === 401) return

      if (response.ok) {
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

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side - Mobile menu button and Shortcut buttons */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Toggle Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}
          <Button variant="ghost" size={isMobile ? "icon" : "sm"} className="gap-2">
            <MessageCircle className="h-4 w-4" />
            {!isMobile && <span>{t('header.feedback')}</span>}
          </Button>
          <Button variant="ghost" size={isMobile ? "icon" : "sm"} className="gap-2">
            <FileText className="h-4 w-4" />
            {!isMobile && <span>{t('header.docs')}</span>}
          </Button>
          <Button variant="ghost" size={isMobile ? "icon" : "sm"} className="gap-2">
            <HelpCircle className="h-4 w-4" />
            {!isMobile && <span>{t('header.help')}</span>}
          </Button>
        </div>

        {/* Right side - Language, Theme toggle and notifications */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-semibold">{t('notifications.title')}</div>
                  {unreadCount > 0 && (
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs"
                      onClick={handleMarkAllAsRead}
                    >
                      {t('notifications.markAllAsRead')}
                    </Button>
                  )}
                </div>
                {loading ? (
                  <div className="text-sm text-muted-foreground">{t('common.loading')}</div>
                ) : notifications.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    {t('notifications.noNewNotifications')}
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="space-y-1 pb-3 border-b last:border-0 last:pb-0 rounded-md p-2 -mx-2 hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start gap-2">
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="text-sm font-semibold">
                                {notification.title}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {formatTimeAgo(notification.createdAt)}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            {notification.link && notification.linkUrl && (
                              <Link
                                href={notification.linkUrl}
                                className="text-sm text-primary hover:underline mt-1 inline-block"
                              >
                                {notification.link}
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {totalNotifications > 5 && (
                  <>
                    <DropdownMenuSeparator className="my-2" />
                    <div className="text-center">
                      <Button
                        variant="link"
                        size="sm"
                        className="w-full"
                        onClick={() => router.push("/notifications")}
                      >
                        {t('notifications.viewAllNotifications')}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
