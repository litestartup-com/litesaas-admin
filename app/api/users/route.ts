import { NextResponse } from "next/server"

// Mock user data
const generateMockUsers = () => {
  const roles = ["Admin", "User"]
  const statuses = ["Active", "Banned"]
  const names = [
    "javayhu",
    "baijin chen",
    "Peter Shi",
    "toown marker",
    "Leo Wang",
    "Sinpor Wang",
    "Mahmut Jomaa",
    "dapeng wang",
    "John Doe",
    "Jane Smith",
    "Alice Johnson",
    "Bob Williams",
    "Charlie Brown",
    "David Lee",
    "Emma Wilson",
    "Frank Miller",
    "Grace Davis",
    "Henry Taylor",
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
    }
  })
}

const MOCK_USERS = generateMockUsers()

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function GET(request: Request) {
  await delay(300)

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "10")
    const search = searchParams.get("search") || ""
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    // Filter users by search
    let filteredUsers = MOCK_USERS
    if (search) {
      const searchLower = search.toLowerCase()
      filteredUsers = MOCK_USERS.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      )
    }

    // Sort users
    filteredUsers.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a]
      let bValue: any = b[sortBy as keyof typeof b]

      if (sortBy === "createdAt") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })

    // Paginate
    const total = filteredUsers.length
    const totalPages = Math.ceil(total / pageSize)
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: {
        users: paginatedUsers,
        pagination: {
          page,
          pageSize,
          total,
          totalPages,
        },
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while fetching users",
        },
      },
      { status: 500 }
    )
  }
}
