"use client"

import { useState, useEffect } from "react"
import { useUI } from "@/store/use-ui"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  Users,
  User,
  CreditCard,
  DollarSign,
  Bell,
  ChevronDown,
  HelpCircle,
  LogOut,
  MessageSquare,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTranslation } from "@/lib/i18n"
import { useUser } from "@/store/use-user"
import { clearAuthToken } from "@/lib/auth"
import { Button } from "@/components/ui/button"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  User,
  CreditCard,
  DollarSign,
  Bell,
  MessageSquare,
}

interface SidebarContentProps {
  isMobile?: boolean
}

export function SidebarContent({ isMobile = false }: SidebarContentProps) {
  const { sidebarOpen, setSidebarOpen } = useUI()
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useTranslation()
  const { user, clearUser } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const menuItems = [
    {
      id: 'dashboard',
      label: t('nav.dashboard'),
      icon: 'LayoutDashboard',
      path: '/dashboard',
    },
    {
      id: 'ai-chat',
      label: t('nav.aiChat'),
      icon: 'MessageSquare',
      path: '/ai-chat',
    },
    {
      id: 'admin',
      label: 'ADMIN',
      icon: undefined,
      children: [
        {
          id: 'users',
          label: t('nav.users'),
          icon: 'Users',
          path: '/admin/users',
        },
      ],
    },
    {
      id: 'settings',
      label: 'SETTINGS',
      icon: undefined,
      children: [
        {
          id: 'profile',
          label: t('nav.profile'),
          icon: 'User',
          path: '/profile',
        },
        {
          id: 'billing',
          label: t('nav.billing'),
          icon: 'CreditCard',
          path: '/billing',
        },
        {
          id: 'credits',
          label: t('nav.credits'),
          icon: 'DollarSign',
          path: '/credits',
        },
        {
          id: 'notifications',
          label: t('nav.notifications'),
          icon: 'Bell',
          path: '/notifications',
        },
      ],
    },
  ]

  const isActive = (path?: string) => {
    if (!path) return false
    return pathname === path || pathname.startsWith(path + '/')
  }

  const handleMenuItemClick = () => {
    // Close sidebar on mobile after selecting a menu item
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }

  const renderMenuItem = (item: typeof menuItems[0]) => {
    if (item.children) {
      if (!sidebarOpen) {
        // Collapsed state: show only icons
        return (
          <div key={item.id} className="mt-6">
            <div className="px-2">
              {item.children.map((child) => {
                const Icon = child.icon ? iconMap[child.icon] : null
                const active = isActive(child.path)

                return (
                  <Link
                    key={child.id}
                    href={child.path || '#'}
                    onClick={handleMenuItemClick}
                    className={cn(
                      "w-full flex items-center justify-center p-2 rounded-md transition-colors mb-1",
                      active
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                    title={child.label}
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                  </Link>
                )
              })}
            </div>
          </div>
        )
      }

      // Expanded state: show full menu
      return (
        <div key={item.id} className="mt-6">
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
            {item.label}
          </div>
          <div className="mt-1 space-y-1">
            {item.children.map((child) => {
              const Icon = child.icon ? iconMap[child.icon] : null
              const active = isActive(child.path)

              return (
                <Link
                  key={child.id}
                  href={child.path || '#'}
                  onClick={handleMenuItemClick}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{child.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )
    }

    const Icon = item.icon ? iconMap[item.icon] : null
    const active = isActive(item.path)

    if (!sidebarOpen) {
      // Collapsed state: show only icon
      return (
        <Link
          key={item.id}
          href={item.path || '#'}
          onClick={handleMenuItemClick}
          className={cn(
            "w-full flex items-center justify-center p-2 rounded-md transition-colors",
            active
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          )}
          title={item.label}
        >
          {Icon && <Icon className="h-5 w-5" />}
        </Link>
      )
    }

    // Expanded state: show full menu item
    return (
      <Link
        key={item.id}
        href={item.path || '#'}
        onClick={handleMenuItemClick}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
          active
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        )}
      >
        {Icon && <Icon className="h-4 w-4" />}
        <span>{item.label}</span>
      </Link>
    )
  }

  return (
    <>
      {/* Mobile Toggle Button - Only show in mobile mode */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
      )}

      {/* Team Section */}
      <div className={cn("p-4 border-b", !sidebarOpen && "p-2")}>
        {sidebarOpen ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-between hover:opacity-80 transition-opacity">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-black text-white flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium">{mounted && user?.name ? `${user.name} Team` : "Team"}</div>
                    <div className="text-xs text-muted-foreground">{mounted && user?.email ? user.email : ""}</div>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Switch Team</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{mounted && user?.name ? `${user.name} Team` : ""}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 rounded bg-black text-white flex items-center justify-center text-sm font-semibold">
              1
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <div className={cn("flex-1 overflow-y-auto space-y-1", sidebarOpen ? "p-4" : "p-2")}>
        {menuItems.map(renderMenuItem)}
      </div>

      {/* User Section - Only show in expanded state or as icon in collapsed */}
      <div className={cn("border-t pb-16", sidebarOpen ? "p-4" : "p-2")}>
        {sidebarOpen ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-between hover:opacity-80 transition-opacity">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback className="bg-black text-white">
                      {mounted && user
                        ? user.name
                          ? user.name.charAt(0).toUpperCase()
                          : user.email
                          ? user.email.charAt(0).toUpperCase()
                          : ""
                        : ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="text-sm font-medium">{mounted && user?.email ? user.email : ""}</div>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{t('header.myAccount')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>{t('nav.profile')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/billing" className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>{t('nav.billing')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>{t('header.helpSupport')}</span>
              </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          clearAuthToken()
                          clearUser()
                          router.push("/login")
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>{t('auth.logout')}</span>
                      </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center justify-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-black text-white">
                {mounted && user
                  ? user.name
                    ? user.name.charAt(0).toUpperCase()
                    : user.email
                    ? user.email.charAt(0).toUpperCase()
                    : ""
                  : ""}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </>
  )
}
