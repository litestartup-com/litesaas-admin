import { NextResponse } from "next/server"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await delay(300)

  try {
    // Mock: Disconnect authentication method
    // In real app, remove the authentication method from user's account

    return NextResponse.json({
      success: true,
      data: {
        message: "Authentication method disconnected successfully",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while disconnecting authentication",
        },
      },
      { status: 500 }
    )
  }
}
