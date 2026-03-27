import { NextResponse } from "next/server"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  await delay(300)

  try {
    const body = await request.json()
    const { reason, expiresAt } = body

    // Validation
    if (!reason || reason.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Ban reason is required",
            details: [{ field: "reason", message: "Ban reason is required" }],
          },
        },
        { status: 400 }
      )
    }

    // Mock: In real app, update user in database
    return NextResponse.json({
      success: true,
      data: {
        message: "User has been banned successfully",
        user: {
          id: params.id,
          status: "Banned",
          banReason: reason,
          banExpires: expiresAt || null,
        },
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while banning user",
        },
      },
      { status: 500 }
    )
  }
}
