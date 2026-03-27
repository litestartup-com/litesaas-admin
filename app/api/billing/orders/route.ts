import { NextResponse } from "next/server"

// Mock order history
const ORDERS: any[] = []

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function GET() {
  await delay(200)

  return NextResponse.json({
    success: true,
    data: ORDERS,
  })
}
