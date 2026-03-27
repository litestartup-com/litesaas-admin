import { NextResponse } from "next/server"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function POST() {
  await delay(200)

  try {
    // Mock: Mark all notifications as read in database
    return NextResponse.json({
      success: true,
      data: {
        message: "All notifications marked as read",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while marking notifications as read",
        },
      },
      { status: 500 }
    )
  }
}
