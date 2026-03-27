import { NextResponse } from "next/server"

// Mock user data (same as in users/route.ts)
const generateMockUsers = () => {
  const names = [
    "javayhu",
    "baijin chen",
    "Peter Shi",
    "toown marker",
    "Leo Wang",
    "Sinpor Wang",
    "Mahmut Jomaa",
    "dapeng wang",
  ]

  return names.map((name, index) => {
    const email = name.toLowerCase().replace(/\s+/g, "") + "@gmail.com"
    const role = index === 0 ? "Admin" : "User"
    const status = index < 2 ? "Active" : index === 3 ? "Banned" : "Active"
    const createdAt = new Date(2025, 3, 11 - (index % 10))
    const customerId = `cus_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

    return {
      id: `user_${index + 1}`,
      name,
      email,
      role,
      status,
      createdAt: createdAt.toISOString().split("T")[0],
      customerId,
      banReason: status === "Banned" ? "Violation of terms" : null,
      banExpires: status === "Banned" ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] : null,
      avatar: null,
      phone: "+1 234 567 8900",
      address: "123 Main St, City, State 12345",
      lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      subscription: {
        plan: index === 0 ? "Pro" : "Free",
        status: index === 0 ? "Active" : "Inactive",
        expiresAt: index === 0 ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
      },
      credits: Math.floor(Math.random() * 10000),
    }
  })
}

const MOCK_USERS = generateMockUsers()

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await delay(200)

  try {
    const user = MOCK_USERS.find((u) => u.id === params.id)

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "User not found",
          },
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while fetching user",
        },
      },
      { status: 500 }
    )
  }
}
