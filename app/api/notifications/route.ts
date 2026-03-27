import { NextResponse } from "next/server"

// Mock notifications data
const generateMockNotifications = () => {
  const notifications = [
    {
      id: "1",
      title: "Welcome",
      sender: "system",
      message: "Welcome to Litestartup! We're honored to be part of your journey. Whenever questions pop up or you need a hand, reach out to us anytime—we're here to help you build momentum and become a trusted partner in your success.",
      link: "Home",
      linkUrl: "/dashboard",
      read: false,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      type: "system",
    },
    {
      id: "2",
      title: "New Feature Available",
      sender: "system",
      message: "We've just released a new feature that might interest you. Check it out!",
      link: "Learn More",
      linkUrl: "/features",
      read: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      type: "feature",
    },
    {
      id: "3",
      title: "Payment Received",
      sender: "billing",
      message: "Your payment of $29.00 has been successfully processed.",
      link: "View Invoice",
      linkUrl: "/billing",
      read: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      type: "billing",
    },
    {
      id: "4",
      title: "Security Alert",
      sender: "security",
      message: "A new device has logged into your account. If this wasn't you, please secure your account immediately.",
      link: "Review Activity",
      linkUrl: "/security",
      read: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      type: "security",
    },
    {
      id: "5",
      title: "Subscription Renewal",
      sender: "billing",
      message: "Your subscription will renew in 7 days. Make sure your payment method is up to date.",
      link: "Update Payment",
      linkUrl: "/billing",
      read: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      type: "billing",
    },
    {
      id: "6",
      title: "Profile Update",
      sender: "system",
      message: "Your profile information has been successfully updated.",
      link: null,
      linkUrl: null,
      read: true,
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      type: "system",
    },
    {
      id: "7",
      title: "Team Invitation",
      sender: "team",
      message: "You've been invited to join a new team. Accept the invitation to get started.",
      link: "View Invitation",
      linkUrl: "/teams",
      read: false,
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      type: "team",
    },
  ]

  return notifications
}

const MOCK_NOTIFICATIONS = generateMockNotifications()

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function GET(request: Request) {
  await delay(200)

  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit")
    const type = searchParams.get("type")
    const status = searchParams.get("status") // "all", "read", "unread"

    let filteredNotifications = [...MOCK_NOTIFICATIONS]

    // Filter by type
    if (type && type !== "all") {
      filteredNotifications = filteredNotifications.filter(
        (n) => n.type === type
      )
    }

    // Filter by status
    if (status && status !== "all") {
      if (status === "read") {
        filteredNotifications = filteredNotifications.filter((n) => n.read)
      } else if (status === "unread") {
        filteredNotifications = filteredNotifications.filter((n) => !n.read)
      }
    }

    // Sort by createdAt (newest first)
    filteredNotifications.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // Apply limit
    if (limit) {
      filteredNotifications = filteredNotifications.slice(0, parseInt(limit))
    }

    return NextResponse.json({
      success: true,
      data: filteredNotifications,
      total: MOCK_NOTIFICATIONS.length,
      unread: MOCK_NOTIFICATIONS.filter((n) => !n.read).length,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while fetching notifications",
        },
      },
      { status: 500 }
    )
  }
}
