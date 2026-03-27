import { NextResponse } from "next/server"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  await delay(300)

  try {
    // Mock: In real app, update user in database
    return NextResponse.json({
      success: true,
      data: {
        message: "User has been unbanned successfully",
        user: {
          id: params.id,
          status: "Active",
          banReason: null,
          banExpires: null,
        },
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while unbanning user",
        },
      },
      { status: 500 }
    )
  }
}
