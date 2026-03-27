import { NextResponse } from "next/server"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  await delay(200)

  try {
    const body = await request.json()
    const { read } = body

    // Mock: Update notification in database
    return NextResponse.json({
      success: true,
      data: {
        id: params.id,
        read: read !== undefined ? read : true,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while updating notification",
        },
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await delay(200)

  try {
    // Mock: Delete notification from database
    return NextResponse.json({
      success: true,
      data: {
        message: "Notification deleted successfully",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while deleting notification",
        },
      },
      { status: 500 }
    )
  }
}
